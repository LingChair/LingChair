import chalk from "chalk"
import Chat from "./Chat.ts"
import User from "./User.ts"

export default class ChatPrivate extends Chat {
    static fromChat(chat: Chat) {
        return new ChatPrivate(chat.bean)
    }

    static getChatIdByUsersId(userIdA: string, userIdB: string) {
        return [userIdA, userIdB].sort().join('-')
    }

    static createForPrivate(userA: User, userB: User) {
        const chat = this.create(this.getChatIdByUsersId(userA.bean.id, userB.bean.id), 'private')
        chat.setMembers([
            userA.bean.id,
            userB.bean.id
        ])
    }
    static findByUsersForPrivate(userA: User, userB: User) {
        const chat = this.findById(this.getChatIdByUsersId(userA.bean.id, userB.bean.id))
        if (chat)
            return this.fromChat(chat as Chat)
    }
    static findOrCreateForPrivate(userA: User, userB: User) {
        let a = this.findByUsersForPrivate(userA, userB)
        if (a == null) {
            this.createForPrivate(userA, userB)
            a = this.findByUsersForPrivate(userA, userB) as ChatPrivate
        }
        return a
    }
}