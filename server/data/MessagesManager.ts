import { DatabaseSync, SQLInputValue } from "node:sqlite"
import { Buffer } from "node:buffer"
import path from 'node:path'
import chalk from "chalk"

import config from "../config.ts"
import Chat from "./Chat.ts"

export default class MessagesManager {
    static table_name: string = "Messages"
    static database: DatabaseSync = this.init()
    
    private static init(): DatabaseSync {
        const db: DatabaseSync = new DatabaseSync(path.join(config.data_path, this.table_name + '.db'))
        return db
    }

    static getInstance(chat: Chat) {
        return new MessagesManager(chat)
    }
    
    declare chat: Chat
    constructor(chat: Chat) {
        this.chat = chat
    }
}
