import { DatabaseSync } from "node:sqlite"
import { Buffer } from "node:buffer"
import path from 'node:path'
import crypto from 'node:crypto'
import fs_sync from 'node:fs'

import { fileTypeFromBuffer } from 'file-type'

export default class FileManager {
    static FileBean = class {
        declare count: number
        declare name: string
        declare hash: string
        declare mime: string
        declare chatid: string | null
        declare upload_time: number
        declare last_used_time: number
    }
    
    static File = class {
        declare bean: FileManager.FileBean
        constructor(bean: FileManager.FileBean) {
            this.bean = bean
        }
        private setAttr(key: string, value: unknown): void {
            FileManager.database.prepare(`UPDATE ${FileManager.table_name} SET ${key} = ? WHERE count = ?`).run(value, this.bean.count)
            this.bean[key] = value
        }
        getMime(): string {
            return this.bean.mime
        }
        getName(): string {
            return this.bean.name
        }
        getFilePath(): string {
            const hash = this.bean.hash
            return path.join(
                config.data_path, 
                "files",
                hash.substring(0, 1),
                hash.substring(2, 3),
                hash.substring(3, 4),
                this.bean.hash
            )
        }
        getChatId(): string | null {
            return this.bean.chatid
        }
        getUploadTime(): number {
            return this.bean.upload_time
        }
        getLastUsedTime(): number {
            return this.bean.last_used_time
        }
        readSync(): Buffer {
            this.setAttr("last_used_time", Date.now())
            return fs_sync.readFileSync(this.getFilePath())
        }
    }

    static table_name: string = "FileReferences"
    private static database: DatabaseSync = FileManager.init()
    private static init(): DatabaseSync {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, FileManager.table_name + '.db'))
        db.exec(`
            CREATE TABLE IF NOT EXISTS ${FileManager.table_name} (
                /* 序号 */ count INTEGER PRIMARY KEY AUTOINCREMENT,
                /* 文件名称 */ name TEXT NOT NULL,
                /* 文件哈希 */ hash TEXT NOT NULL,
                /* MIME 类型 */ mime TEXT NOT NULL,
                /* 来源 Chat, 可為空 */ chatid TEXT,
                /* 上传时间 */ upload_time INT8 NOT NULL,
                /* 最后使用时间 */ last_used_time INT8 NOT NULL
            );
       `)
       return db
    }
    
    static uploadFile(fileName: string, data: Buffer, chatId: string | null) {
        const hash = crypto.createHash('sha256').update(data).digest('hex')
        try {
            return FileManager.findByHash(hash)
        } catch(_e) {
            // Do nothing...
        }
        
        const mime = fileTypeFromBuffer(data)
        fs_sync.writeFileSync(
            path.join(
                config.data_path, 
                "files",
                hash.substring(0, 1),
                hash.substring(2, 3),
                hash.substring(3, 4),
                hash
            ),
            data
        )
        return new FileManager.File(
            FileManager.findAllBeansByCondition(
                'count = ?', 
                FileManager.database.prepare(`INSERT INTO ${FileManager.table_name} (
                    name,
                    hash,
                    mime,
                    chatid,
                    upload_time,
                    last_used_time
                ) VALUES (?, ?, ?, ?, ?, ?);`).run(
                    fileName,
                    hash,
                    mime,
                    chatId,
                    Date.now(),
                    -1
                ).lastInsertRowid
            )[0]
        )
    }
    
    private static findAllBeansByCondition(condition: string, ...args: unknown[]): FileManager.FileBean[] {
        return FileManager.database.prepare(`SELECT * FROM ${FileManager.table_name} WHERE ${condition};`).all(...args)
    }
    static findByHash(hash: string): FileManager.File {
        const beans = FileManager.findAllBeansByCondition('hash = ?', hash)
        if (beans.length == 0)
            throw new Error(`找不到 hash 为 ${hash} 的文件`)
        else if (beans.length > 1)
            console.error(chalk.red(`警告: 查询 hash = ${id} 时, 查询到多个相同 Hash 的文件`))
        return new FileManager.File(beans[0])
    }
}
