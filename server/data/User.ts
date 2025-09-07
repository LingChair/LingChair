import { DatabaseSync } from "node:sqlite"
import { Buffer } from "node:buffer"
import path from 'node:path'
import crypto from 'node:crypto'

import chalk from 'chalk'

import config from '../config.ts'
import UserBean from './UserBean.ts'

import FileManager from './FileManager.ts'
import { SQLInputValue } from "node:sqlite";
import DataWrongError from "../api/DataWrongError.ts";

/**
 * User.ts - Wrapper and manager
 * Wrap with UserBean to directly update database
 * Manage the database by itself (static)
 */
export default class User {
    static table_name: string = "Users"
    private static database: DatabaseSync = User.init()
    private static init() {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, User.table_name + '.db'))
        db.exec(`
            CREATE TABLE IF NOT EXISTS ${User.table_name} (
                /* 序号 */ count INTEGER PRIMARY KEY AUTOINCREMENT,
                /* 用户 ID, UUID */ id TEXT,
                /* 密碼, 哈希 */ password TEXT,
                /* 注册时间, 时间戳 */ registered_time INT8 NOT NULL,
                /* 用戶名, 可選 */ username TEXT,
                /* 昵称 */ nickname TEXT NOT NULL,
                /* 头像, 可选 */ avatar_file_hash TEXT,
                /* 设置 */ settings TEXT NOT NULL
            );
       `)
       return db
    }
    
    static createWithUserNameChecked(userName: string | null, password: string, nickName: string, avatar: Buffer | null) {
        if (userName && User.findAllBeansByCondition('username = ?', userName).length > 0)
            throw new DataWrongError(`用户名 ${userName} 已存在`)
         return User.create(
            userName,
            password,
            nickName,
            avatar
        )
    }
    
    static create(userName: string | null, password: string, nickName: string, avatar: Buffer | null) {
        const user = new User(
            User.findAllBeansByCondition(
                'count = ?', 
                User.database.prepare(`INSERT INTO ${User.table_name} (
                    id,
                    password,
                    registered_time,
                    username,
                    nickname,
                    avatar_file_hash,
                    settings
                ) VALUES (?, ?, ?, ?, ?, ?, ?);`).run(
                    crypto.randomUUID(),
                    password,
                    Date.now(),
                    userName,
                    nickName,
                    null,
                    "{}"
                ).lastInsertRowid
            )[0]
        )
        avatar && user.setAvatar(avatar)
        return user
    }
    
    private static findAllBeansByCondition(condition: string, ...args: SQLInputValue[]): UserBean[] {
        return User.database.prepare(`SELECT * FROM ${User.table_name} WHERE ${condition};`).all(...args) as unknown as UserBean[]
    }
    static findById(id: string) {
        const beans = User.findAllBeansByCondition('id = ?', id)
        if (beans.length == 0)
            return null
        else if (beans.length > 1)
            console.error(chalk.red(`警告: 查询 id = ${id} 时, 查询到多个相同用户 ID 的用户`))
        return new User(beans[0])
    }
    static findByUserName(userName: string) {
        const beans = User.findAllBeansByCondition('username = ?', userName)
        if (beans.length == 0)
            return null
        else if (beans.length > 1)
            console.error(chalk.red(`警告: 查询 username = ${userName} 时, 查询到多个相同用户名的用户`))
        return new User(beans[0])
    }
    
    declare bean: UserBean
    constructor(bean: UserBean) {
        this.bean = bean
    }
    /* 一切的基础都是 count ID */
    private setAttr(key: string, value: unknown) {
        User.database.prepare(`UPDATE ${User.table_name} SET ${key} = ? WHERE count = ?`).run(value, this.bean.count)
        this.bean[key] = value
    }
    getUserName(): string | null {
        return this.bean.username
    }
    setUserName(userName: string) {
        this.setAttr("username", userName)
    }
    getNickName(): string {
        return this.bean.nickname
    }
    setNickName(nickName: string) {
        this.setAttr("nickname", nickName)
    }
    getPassword(): string {
        return this.bean.password
    }
    setPassword(password: string) {
        this.setAttr("password", password)
    }
    getAvatar(): Buffer | null {
        return FileManager.findByHash(this.bean.avatar_file_hash)?.readSync()
    }
    setAvatar(avatar: Buffer) {
        this.setAttr("avatar_file_hash", FileManager.uploadFile(`avatar_user_${this.bean.count}`, avatar).getHash())
    }
    
    getSettings() {
        return new User.Settings(this, JSON.parse(this.bean.settings))
    }
    
    static Settings = class {
        declare bean: User.SettingsBean
        declare user: User
        constructor(user: User, bean: User.SettingsBean) {
            this.bean = bean
            this.user = user
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
            this.user.setAttr("settings", JSON.stringify(this.bean))
        }
    }
    static SettingsBean = class {
        
    }
}
