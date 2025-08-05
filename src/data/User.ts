import { DatabaseSync } from "node:sqlite"
import { Buffer } from "node:buffer"
import path from 'node:path'
import crypto from 'node:crypto'

import config from '../config.ts'
import UserBean from './UserBean.ts'

/**
 * User.ts - Wrapper and manager
 * Wrap with UserBean to directly update database
 * Manage the database by itself (static)
 */
export default class User {
    static table_name: string = "Users"
    private static database: DatabaseSync = User.init()
    private static init(): DatabaseSync {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, 'Users.db'))
        db.exec(`
            CREATE TABLE IF NOT EXISTS ${User.table_name} (
                /* 序号 */ count INTEGER PRIMARY KEY AUTOINCREMENT,
                /* 用户 ID, 哈希 */ id TEXT,
                /* 注册时间, 时间戳 */ registered_time INT8 NOT NULL,
                /* 用戶名, 可選 */ username TEXT,
                /* 昵称 */ nickname TEXT NOT NULL,
                /* 头像, 可选 */ avatar BLOB,
                /* 设置 */ settings TEXT NOT NULL
            );
       `)
       return db
    }
    
    static create(userName: string | null, nickName: string, avatar: Buffer | null): User {
        return new User(
            User.findAllBeansByCondition(
                'count = ?', 
                User.database.prepare(`INSERT INTO ${User.table_name} (
                    id,
                    registered_time,
                    username,
                    nickname,
                    avatar,
                    settings
                ) VALUES (?, ?, ?, ?, ?, ?)`).run(
                    crypto.randomUUID(),
                    Date.now(),
                    userName,
                    nickName,
                    avatar,
                    "{}"
                ).lastInsertRowid
            )[0]
        )
    }
    
    private static findAllBeansByCondition(condition: string, ...args: unknown[]): UserBean[] {
        return User.database.prepare(`SELECT * FROM ${User.table_name} WHERE ${condition}`).all(...args)
    }
    private static checkLengthOrThrow(array: Array, leng: number, errMsg: string): Array {
        if (array.length != leng) throw new Error(errMsg)
        return array
    }
    static findById(id: string): User {
        return new User(checkLengthOrThrow(User.findAllBeansByCondition('id = ?', id), 1, `找不到用户 ID 为 ${id} 的用户`)[0])
    }
    static findByUserName(userName: string): User {
        return new User(checkLengthOrThrow(User.findAllBeansByCondition('username = ?', userName), 1, `找不到用户名为 ${userName} 的用户`)[0])
    }
    
    declare bean: UserBean
    constructor(bean: UserBean) {
        this.bean = bean
    }
    /* 一切的基础都是 count ID */
    private setAttr(key: string, value: unknown): void {
        User.database.prepare(`UPDATE ${User.table_name} SET ${key} = ? WHERE count = ?`).run(value, this.bean.count)
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
    
    /* getSettings(): Settings {
        
    }
    
    static Settings = class {
        
    }
    static SettingsBean = interface {
        
    } */
}
