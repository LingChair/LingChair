import { DatabaseSync } from "node:sqlite"
// import { Buffer } from "node:buffer"
import path from 'node:path'

import config from '../config.ts'
import ChatBean from './ChatBean.ts'
import { SQLInputValue } from "node:sqlite"
import chalk from "chalk"

/**
 * Chat.ts - Wrapper and manager
 * Wrap with ChatBean to directly update database
 * Manage the database by itself (static)
 */
export default class Chat {
    static table_name: string = "Chat"
    private static database: DatabaseSync = Chat.init()
    private static init(): DatabaseSync {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, 'Chats.db'))
        db.exec(`
            CREATE TABLE IF NOT EXISTS ${Chat.table_name} (
                /* 序号 */ count INTEGER PRIMARY KEY AUTOINCREMENT,
                /* Chat ID, 哈希 */ id TEXT,
                /* 设置 */ settings TEXT NOT NULL
            );
       `)
       return db
    }
    
    private static findAllBeansByCondition(condition: string, ...args: SQLInputValue[]): ChatBean[] {
        return this.database.prepare(`SELECT * FROM ${Chat.table_name} WHERE ${condition}`).all(...args) as unknown as ChatBean[]
    }
    
    static findById(id: string): Chat {
        const beans = this.findAllBeansByCondition('id = ?', id)
        if (beans.length == 0)
            throw new Error(`找不到 id 为 ${id} 的 Chat`)
        else if (beans.length > 1)
            console.error(chalk.red(`警告: 查询 id = ${id} 时, 查询到多个相同 ID 的 Chat`))
        return new Chat(beans[0])
    }
    
    declare bean: ChatBean
    constructor(bean: ChatBean) {
        this.bean = bean
    }
    private setAttr(key: string, value: SQLInputValue): void {
        Chat.database.prepare(`UPDATE ${Chat.table_name} SET ${key} = ? WHERE id = ?`).run(value, this.bean.id)
        this.bean[key] = value
    }
}
