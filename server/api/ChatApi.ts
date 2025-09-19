import Chat from "../data/Chat.ts";
import ChatPrivate from "../data/ChatPrivate.ts";
import User from "../data/User.ts"
import BaseApi from "./BaseApi.ts"
import TokenManager from "./TokenManager.ts"

export default class ChatApi extends BaseApi {
    override getName(): string {
        return "Chat"
    }
    override onInit(): void {
        this.registerEvent("Chat.getInfo", (args) => {
            if (this.checkArgsMissing(args, ['token', 'target'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
            }

            const chat = Chat.findById(args.target as string)
            if (chat == null) return {
                code: 404,
                msg: "對話不存在",
            }

            // 私聊
            if (chat!.bean.type == 'private') {
                const targetId = args.target as string
                const target = User.findById(targetId)
                const mine = User.findById(token.author) as User
                if (target == null) return {
                    code: 404,
                    msg: "找不到用户",
                }

                return {
                    code: 200,
                    msg: "成功",
                    data: {
                        type: chat.bean.type,
                        title: ChatPrivate.fromChat(chat).getTitleForPrivate(mine, target)
                    }
                }
            }

            return {
                code: 501,
                msg: "not implmented",
            }
        })
        this.registerEvent("Chat.sendMessage", (args) => {
            if (this.checkArgsMissing(args, ['token', 'target'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
            }

            return {
                code: 501,
                msg: "未實現",
            }
        })
        this.registerEvent("Chat.getMessageHistory", (args) => {
            if (this.checkArgsMissing(args, ['token', 'target'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
            }

            return {
                code: 501,
                msg: "未實現",
            }
        })
    }
}