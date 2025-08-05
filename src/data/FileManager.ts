import { DatabaseSync } from "node:sqlite"
import { Buffer } from "node:buffer"
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'

import { fileTypeFromBuffer } from 'file-type'

export default class FileManager {
    static FileBean = interface {
        count: number,
        name: string,
        hash: string,
        mime: string,
    }
    
    static File = class {
        declare bean: FileManager.FileBean
        constructor(bean: UserBean) {
            this.bean = bean
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
        async readAsync(): Buffer {
            return await fs.readFile(this.getFilePath())
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
                /* MIME 类型 */ mime TEXT NOT NULL
            );
       `)
       return db
    }
    
    static uploadFile(fileName: string, data: Buffer) {
        const hash = crypto.createHash('sha256').update(data).digest('hex')
        mime = fileTypeFromBuffer(data)
        
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
