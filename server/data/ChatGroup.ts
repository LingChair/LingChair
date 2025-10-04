import chalk from "chalk"
import Chat from "./Chat.ts"
import User from "./User.ts"

export default class ChatGroup extends Chat {
    static fromChat(chat: Chat) {
        return new ChatGroup(chat.bean)
    }

    static createGroup(chatId?: string) {
        return this.create(chatId || crypto.randomUUID(), 'group')
    }
}