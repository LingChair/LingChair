import { DatabaseSync } from "node:sqlite"
// import { Buffer } from "node:buffer"
import path from 'node:path'

import config from '../config.ts'
import ChatBean from './ChatBean.ts'
import { SQLInputValue } from "node:sqlite"
import chalk from "chalk"
import User from "./User.ts"
import ChatType from "./ChatType.ts"
import UserChatLinker from "./UserChatLinker.ts"
import DataWrongError from '../api/DataWrongError.ts'

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
                /* 类型 */ type TEXT NOT NULL,
                /*  ID  */ id TEXT NOT NULL,
                /* 标题 */ title TEXT,
                /* 头像 */ avatar BLOB,
                /* 设置 */ settings TEXT NOT NULL
            );
       `)
        return db
    }

    protected static findAllBeansByCondition(condition: string, ...args: SQLInputValue[]): ChatBean[] {
        return this.database.prepare(`SELECT * FROM ${Chat.table_name} WHERE ${condition}`).all(...args) as unknown as ChatBean[]
    }

    static findById(id: string) {
        const beans = this.findAllBeansByCondition('id = ?', id)
        if (beans.length == 0)
            return null
        else if (beans.length > 1)
            console.error(chalk.red(`警告: 查询 id = ${id} 时, 查询到多个相同 ID 的 Chat`))
        return new Chat(beans[0])
    }

    static create(chatId: string, type: ChatType) {
        if (this.findAllBeansByCondition('id = ?', chatId).length > 0)
            throw new DataWrongError(`对话 ID ${chatId} 已被使用`)
        const chat = new Chat(
            Chat.findAllBeansByCondition(
                'count = ?',
                Chat.database.prepare(`INSERT INTO ${Chat.table_name} (
                    type,
                    id,
                    title,
                    avatar,
                    settings
                ) VALUES (?, ?, ?, ?, ?);`).run(
                    type,
                    chatId,
                    null,
                    null,
                    "{}"
                ).lastInsertRowid
            )[0]
        )
        return chat
    }

    declare bean: ChatBean
    constructor(bean: ChatBean) {
        this.bean = bean
    }
    setAttr(key: string, value: SQLInputValue): void {
        Chat.database.prepare(`UPDATE ${Chat.table_name} SET ${key} = ? WHERE id = ?`).run(value, this.bean.id)
        this.bean[key] = value
    }

    getMembersList() {
        return UserChatLinker.getChatMembers(this.bean.id)
    }
    addMembers(userIds: string[]) {
        userIds.forEach((v) => UserChatLinker.linkUserAndChat(v, this.bean.id))
    }
    removeMembers(userIds: string[]) {
        userIds.forEach((v) => UserChatLinker.unlinkUserAndChat(v, this.bean.id))
    }
    getAnotherUserForPrivate(userMySelf: User) {
        const members = this.getMembersList()
        const user_a_id = members[0]
        const user_b_id = members[1]
        if (members.length == 1 && user_a_id == userMySelf.bean.id)
            return userMySelf
        // 注意: 這裏已經確定了 Chat, 不需要再指定對方用戶
        if (user_a_id == userMySelf.bean.id)
            return User.findById(user_b_id as string)
        if (user_b_id == userMySelf.bean.id)
            return User.findById(user_a_id as string)

        return null
    }
    setTitle(title: string) {
        if (this.bean.type == 'private')
            throw new Error('不允许对私聊进行命名')
        this.setAttr('title', title)
    }
    getTitle(userMySelf?: User) {
        if (this.bean.type == 'group') return this.bean.title
        if (this.bean.type == 'private') return this.getAnotherUserForPrivate(userMySelf as User)?.getNickName()
    }
    getAvatarFileHash(userMySelf?: User) {
        if (this.bean.type == 'group') return this.bean.avatar_file_hash
        if (this.bean.type == 'private') return this.getAnotherUserForPrivate(userMySelf as User)?.getAvatarFileHash()
    }
}
