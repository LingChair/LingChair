import data from "../Data.ts"
import Client from "./Client.ts"
import Chat from "./client_data/Chat.ts"
import User from "./client_data/User.ts"

export default class DataCaches {
    static userProfiles: { [key: string]: User} = {}
    static async getUserProfile(userId: string): Promise<User> {
        if (this.userProfiles[userId]) return this.userProfiles[userId]
        const re = await Client.invoke("User.getInfo", {
            token: data.access_token,
            target: userId
        })
        if (re.code != 200) return {
            id: '',
            nickname: "",
        }
        return this.userProfiles[userId] = (re.data as unknown as User)
    }
    static chatInfos: { [key: string]: Chat} = {}
    static async getChatInfo(chatId: string): Promise<Chat> {
        if (this.chatInfos[chatId]) return this.chatInfos[chatId]
        const re = await Client.invoke('Chat.getInfo', {
            token: data.access_token,
            target: chatId,
        })
        if (re.code != 200) return {
            id: '',
            title: '',
            type: '' as any,
            is_admin: false,
            is_member: false,
        }
        return this.chatInfos[chatId] = (re.data as unknown as Chat)
    }
}