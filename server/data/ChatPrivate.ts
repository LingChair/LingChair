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
        return this.create(this.getChatIdByUsersId(userA.bean.id, userB.bean.id), 'private')
    }
    static findForPrivate(userA: User, userB: User) {
        return this.fromChat(this.findById(this.getChatIdByUsersId(userA.bean.id, userB.bean.id)) as Chat)
    }
    static findOrCreateForPrivate(userA: User, userB: User) {
        let a = this.findForPrivate(userA, userB)
        if (a == null) {
            this.createForPrivate(userA, userB)
            a = this.findForPrivate(userA, userB) as ChatPrivate
        }
        return a
    }

    getTitleForPrivate(user: User, targetUser: User) {
        const chat = Chat.findById(ChatPrivate.getChatIdByUsersId(user.bean.id, targetUser.bean.id))

        if (chat?.bean.user_a_id == user.bean.id)
            return targetUser.getNickName()
        if (chat?.bean.user_b_id == user.bean.id)
            return user.getNickName()

        return "未知對話"
    }
}