import User from "../data/User.ts"
import BaseApi from "./BaseApi.ts"

export default class UserApi extends BaseApi {
    override getName(): string {
        return "Chat"
    }
    override onInit(): void {
        this.registerEvent("Chat.sendMessage", (args) => {

            return {
                code: 501,
                msg: "未實現",
            }
        })
        this.registerEvent("Chat.getMessageHistory", (args) => {

            return {
                code: 501,
                msg: "未實現",
            }
        })
    }
}