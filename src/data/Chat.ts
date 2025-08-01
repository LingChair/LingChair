import { DatabaseSync } from "node:sqlite"
import { Buffer } from "node:buffer"
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
    
    private static findAllByCondition(condition: string, ...args: unknown[]): UserBean[] {
        return database.prepare(`SELECT count, id FROM ${User.table_name} WHERE ${condition}`).all(...args)
    }
    
    
    
    declare bean: ChatBean
    constructor(bean: ChatBean) {
        this.bean = bean
    }
    private setAttr(key: string, value: unknown): void {
        User.database.prepare(`UPDATE ${User.table_name} SET ${key} = ? WHERE id = ?`).run(value, this.bean.id)
        this.bean[key] = value
    }
    getUserName(): string {
        return this.bean.username
    }
    setUserName(userName: string): void {
        this.setAttr("username", userName)
    }
    getNickName(): string {
        return this.bean.nickname
    }
    setNickName(nickName: string): void {
        this.setAttr("nickname", nickName)
    }
    getAvatar(): Uint8Array {
        return this.bean.avatar
    }
    setAvatar(avatar: Buffer): void {
        this.setAttr("avatar", avatar)
    }
    
    getContacts() {
        
    }
}
