import { DatabaseSync } from "node:sqlite"
// import { Buffer } from "node:buffer"
import path from 'node:path'

import config from '../config.ts'
import ChatBean from './ChatBean.ts'

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
    
    private static findAllByCondition(condition: string, ...args: unknown[]): ChatBean[] {
        return database.prepare(`SELECT * FROM ${Chat.table_name} WHERE ${condition}`).all(...args)
    }
    
    static findById(id: string): Chat {
        const beans = Chat.findAllBeansByCondition('id = ?', id)
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
    private setAttr(key: string, value: unknown): void {
        User.database.prepare(`UPDATE ${Chat.table_name} SET ${key} = ? WHERE id = ?`).run(value, this.bean.id)
        this.bean[key] = value
    }
    
    getSettings(): Chat.Settings {
        return new Chat.Settings(this, JSON.parse(this.bean.settings))
    }
    
    static Settings = class {
        declare bean: Chat.SettingsBean
        declare chat: Chat
        constructor(chat: Chat, bean: Chat.SettingsBean) {
            this.bean = bean
            this.chat = chat
            for (const i of [
                
            ]) {
                this["set" + i.substring(0, 1).toUpperCase() + i.substring(1)] = (v: unknown) => {
                    this.set(i, v)
                }
            }
        }
        
        set(key: string, value: unknown) {
            this.bean[key] = value
        }
        get(key: string) {
            return this.bean[key]
        }
        apply() {
            this.chat.setAttr("settings", JSON.stringify(this.bean))
        }
    }
    static SettingsBean = class {
        
    }
}
