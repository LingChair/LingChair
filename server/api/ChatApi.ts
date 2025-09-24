import { Buffer } from "node:buffer"
import Chat from "../data/Chat.ts"
import FileManager from "../data/FileManager.ts"
import MessagesManager from "../data/MessagesManager.ts"
import User from "../data/User.ts"
import UserChatLinker from "../data/UserChatLinker.ts"
import ApiManager from "./ApiManager.ts"
import BaseApi from "./BaseApi.ts"
import TokenManager from "./TokenManager.ts"

export default class ChatApi extends BaseApi {
    override getName(): string {
        return "Chat"
    }
    override onInit(): void {
        /**
         * 獲取對話訊息
         * @param token 令牌
         * @param target 目標對話
         */
        this.registerEvent("Chat.getInfo", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token', 'target'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
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
                const mine = User.findById(token.author) as User

                return {
                    code: 200,
                    msg: "成功",
                    data: {
                        type: chat.bean.type,
                        title: chat.getTitle(mine),
                        avatar: chat.getAvatarFileHash(mine) ? "uploaded_files/" + chat.getAvatarFileHash(mine) : undefined
                    }
                }
            }

            return {
                code: 501,
                msg: "not implmented",
            }
        })
        /**
         * 發送訊息
         * @param token 令牌
         * @param target 目標對話
         * @param text 消息内容
         */
        this.registerEvent("Chat.sendMessage", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token', 'target', 'text'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌無效",
            }

            const chat = Chat.findById(args.target as string)
            if (chat == null) return {
                code: 404,
                msg: "對話不存在",
            }
            if (!UserChatLinker.checkUserIsLinkedToChat(token.author, chat!.bean.id)) return {
                code: 400,
                msg: "用戶無權訪問該對話",
            }

            const msg = {
                text: args.text as string,
                user_id: token.author,
            }
            const id = MessagesManager.getInstanceForChat(chat).addMessage(msg)

            const users: string[] = []
            if (chat.bean.type == 'private') {
                users.push(token.author as string)
            }

            for (const user of users) {
                if (ApiManager.checkUserIsOnline(user)) {
                    const sockets = ApiManager.getUserClientSockets(user)
                    for (const socket of Object.keys(sockets))
                        this.emitToClient(sockets[socket], 'Client.onMessage', {
                            chat: chat.bean.id,
                            msg: {
                                ...msg,
                                id
                            }
                        })
                } else {
                    // TODO: EventStore
                }
            }

            return {
                code: 200,
                msg: "成功",
            }
        })
        /**
         * 拉取歷史訊息
         * @param token 令牌
         * @param target 目標對話
         * @param page 頁面
         */
        this.registerEvent("Chat.getMessageHistory", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token', 'target', 'page'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌無效",
            }

            const chat = Chat.findById(args.target as string)
            if (chat == null) return {
                code: 404,
                msg: "對話不存在",
            }
            if (!UserChatLinker.checkUserIsLinkedToChat(token.author, chat!.bean.id)) return {
                code: 400,
                msg: "用戶無權訪問該對話",
            }

            return {
                code: 200,
                msg: "成功",
                data: {
                    messages: MessagesManager.getInstanceForChat(chat).getMessagesWithPage(15, args.page as number),
                },
            }
        })
        /**
         * 上傳文件
         * @param token 令牌
         * @param target 目標對話
         * @param file_name 文件名稱
         * @param data 文件二進制數據
         */
        this.registerEvent("Chat.uploadFile", async (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token', 'target', 'data', 'file_name'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌無效",
            }

            const chat = Chat.findById(args.target as string)
            if (chat == null) return {
                code: 404,
                msg: "對話不存在",
            }
            if (!UserChatLinker.checkUserIsLinkedToChat(token.author, chat!.bean.id)) return {
                code: 400,
                msg: "用戶無權訪問該對話",
            }

            const file = await FileManager.uploadFile(args.file_name as string, args.data as Buffer<ArrayBufferLike>, args.target as string)

            return {
                code: 200,
                msg: "成功",
                data: {
                    file_path: 'uploaded_files/' + file.getHash()
                },
            }
        })
    }
}