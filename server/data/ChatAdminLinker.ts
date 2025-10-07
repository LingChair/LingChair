import { DatabaseSync } from "node:sqlite"
import path from 'node:path'

import config from "../config.ts"
import { SQLInputValue } from "node:sqlite"
export default class ChatAdminLinker {
    static database: DatabaseSync = this.init()

    private static init(): DatabaseSync {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, 'ChatAdminLinker.db'))
        db.exec(`
            CREATE TABLE IF NOT EXISTS ChatAdminLinker (
                /* 序号 */ count INTEGER PRIMARY KEY AUTOINCREMENT,
                /* 用戶 ID */ user_id TEXT NOT NULL,
                /* Chat ID */ chat_id TEXT NOT NULL,
                /* 管理权限 */ permissions TEXT NOT NULL
            );
       `)
        return db
    }

    static linkAdminAndChat(userId: string, chatId: string) {
        if (!this.checkAdminIsLinkedToChat(userId, chatId))
            this.database.prepare(`INSERT INTO ChatAdminLinker (
                user_id,
                chat_id,
                permissions
            ) VALUES (?, ?, ?);`).run(
                userId,
                chatId,
                '[]'
            )
    }
    static updatePermissions(userId: string, chatId: string, permissions: string) {
        this.database.prepare(`UPDATE ChatAdminLinker SET permissions = ? WHERE user_id = ? AND chat_id = ?`).run(permissions, userId, chatId)
    }
    static unlinkAdminAndChat(userId: string, chatId: string) {
        this.database.prepare(`DELETE FROM ChatAdminLinker WHERE user_id = ? AND chat_id = ?`).run(userId, chatId)
    }
    static checkAdminIsLinkedToChat(userId: string, chatId: string) {
        return this.findAllByCondition('user_id = ? AND chat_id = ?', userId, chatId).length != 0
    }
    static getChatAdmins(chatId: string) {
        return this.findAllByCondition('chat_id = ?', chatId).map((v) => v.user_id) as string[]
    }
    protected static findAllByCondition(condition: string, ...args: SQLInputValue[]) {
        return this.database.prepare(`SELECT * FROM ChatAdminLinker WHERE ${condition}`).all(...args)
    }
}
