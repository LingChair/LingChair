import data from "../Data.ts"
import Client from "./Client.ts"
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
}