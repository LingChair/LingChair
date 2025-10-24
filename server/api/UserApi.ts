import { Buffer } from "node:buffer"
import User from "../data/User.ts"
import BaseApi from "./BaseApi.ts"
import TokenManager from "./TokenManager.ts"
import ChatPrivate from "../data/ChatPrivate.ts"
import Chat from "../data/Chat.ts"
import chalk from "chalk"
import ApiManager from "./ApiManager.ts"

export default class UserApi extends BaseApi {
    override getName(): string {
        return "User"
    }
    override onInit(): void {
        // 驗證
        this.registerEvent("User.auth", (args, clientInfo) => {
            if (this.checkArgsMissing(args, ['access_token'])) return {
                msg: "参数缺失",
                code: 400,
            }
            const { deviceId, ip, socket, sessionId } = clientInfo
            try {
                const access_token = TokenManager.decode(args.access_token as string)

                if (access_token.expired_time < Date.now()) return {
                    msg: "登录令牌失效",
                    code: 401,
                }
                if (!access_token.author || !User.findById(access_token.author)) return {
                    msg: "账号不存在",
                    code: 401,
                }
                if (access_token.device_id != deviceId) return {
                    msg: "验证失败",
                    code: 401,
                }

                clientInfo.userId = access_token.author
                console.log(chalk.green('[验]') + ` ${access_token.author} authed on Client ${deviceId} (ip = ${ip})`)
                if (ApiManager.clients[clientInfo.userId] == null) ApiManager.clients[clientInfo.userId] = {
                    [deviceId + '_' + sessionId]: socket
                }
                else ApiManager.clients[clientInfo.userId][deviceId + '_' + sessionId] = socket

                return {
                    msg: "成功",
                    code: 200,
                }
            } catch (e) {
                const err = e as Error
                if (err.message.indexOf("JSON") != -1)
                    return {
                        msg: "无效的用户令牌",
                        code: 401,
                    }
                else
                    throw e
            }
        })
        // 刷新访问令牌
        this.registerEvent("User.refreshAccessToken", (args, clientInfo) => {
            if (this.checkArgsMissing(args, ['refresh_token'])) return {
                msg: "参数缺失",
                code: 400,
            }
            const { deviceId } = clientInfo
            try {
                const refresh_token = TokenManager.decode(args.refresh_token as string)

                if (refresh_token.expired_time < Date.now()) return {
                    msg: "登录令牌失效",
                    code: 401,
                }
                if (!refresh_token.author || !User.findById(refresh_token.author)) return {
                    msg: "账号不存在",
                    code: 401,
                }
                if (refresh_token.device_id != deviceId) return {
                    msg: "验证失败",
                    code: 401,
                }
                
                const user = User.findById(refresh_token.author) as User

                return {
                    msg: "成功",
                    code: 200,
                    data: {
                        access_token: TokenManager.make(user, null, deviceId)
                    }
                }
            } catch (e) {
                const err = e as Error
                if (err.message.indexOf("JSON") != -1)
                    return {
                        msg: "无效的用户令牌",
                        code: 401,
                    }
                else
                    throw e
            }
        })
        // 登錄
        this.registerEvent("User.login", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['account', 'password'])) return {
                msg: "参数缺失",
                code: 400,
            }
            if (this.checkArgsEmpty(args, ['account', 'password'])) return {
                msg: "参数不得为空",
                code: 400,
            }

            const user = User.findByAccount(args.account as string) as User
            if (user == null) return {
                msg: "账号或密码错误",
                code: 400,
            }

            if (user.getPassword() == args.password) return {
                msg: "成功",
                code: 200,
                data: {
                    refresh_token: TokenManager.make(user, null, deviceId, 'refresh_token'),
                    access_token: TokenManager.make(user, null, deviceId),
                },
            }

            return {
                msg: "账号或密码错误",
                code: 400,
            }
        })
        // 注冊
        this.registerEvent("User.register", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['nickname', 'password'])) return {
                msg: "参数缺失",
                code: 400,
            }
            if (this.checkArgsEmpty(args, ['nickname', 'password'])) return {
                msg: "参数不得为空",
                code: 400,
            }

            const username: string | null = args.username as string
            const nickname: string = args.nickname as string
            const password: string = args.password as string

            const user = User.create(username, password, nickname, null)

            return {
                msg: "成功",
                code: 200,
                data: {
                    userid: user.bean.id
                },
            }
        })
        /*
         * ================================================
         *                    個人資料
         * ================================================
         */
        // 更新頭像
        this.registerEvent("User.setAvatar", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['avatar', 'token'])) return {
                msg: "参数缺失",
                code: 400,
            }
            if (!(args.avatar instanceof Buffer)) return {
                msg: "参数不合法",
                code: 400,
            }
            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const avatar: Buffer = args.avatar as Buffer
            const user = User.findById(token.author)
            user!.setAvatar(avatar)

            return {
                msg: "成功",
                code: 200,
            }
        })
        // 更新資料
        this.registerEvent("User.updateProfile", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "参数缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const user = User.findById(token.author)
            if (args.nickname != null)
                user!.setNickName(args.nickname as string)
            if (args.username != null)
                user!.setUserName(args.username as string)

            return {
                msg: "成功",
                code: 200,
            }
        })
        // 獲取用戶信息
        this.registerEvent("User.getMyInfo", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "参数缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const user = User.findById(token.author)

            return {
                msg: "成功",
                code: 200,
                data: {
                    username: user!.getUserName(),
                    nickname: user!.getNickName(),
                    avatar_file_hash: user!.getAvatarFileHash() ? user!.getAvatarFileHash() : null,
                    id: token.author,
                }
            }
        })
        // 獲取最近对话列表
        this.registerEvent("User.getMyRecentChats", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "参数缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const user = User.findById(token.author) as User
            const recentChats = user.getRecentChats()
            const recentChatsList = []
            for (const [chatId, content] of recentChats) {
                const chat = Chat.findById(chatId)
                recentChatsList.push({
                    content,
                    id: chatId,
                    title: chat?.getTitle(user) || "未知",
                    avatar_file_hash: chat?.getAvatarFileHash(user) ? chat?.getAvatarFileHash(user) : undefined
                })
            }

            return {
                msg: "成功",
                code: 200,
                data: {
                    recent_chats: recentChatsList.reverse(),
                }
            }
        })
        // 獲取聯絡人列表
        this.registerEvent("User.getMyContacts", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "参数缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const user = User.findById(token.author) as User
            const contacts = user.getContactsList()
            contacts.push(ChatPrivate.getChatIdByUsersId(token.author, token.author))

            return {
                msg: "成功",
                code: 200,
                data: {
                    contacts_list: contacts.map((id) => {
                        const chat = Chat.findById(id)
                        return {
                            id,
                            type: chat?.bean.type,
                            title: chat?.getTitle(user) || "未知",
                            avatar_file_hash: chat?.getAvatarFileHash(user) ? chat?.getAvatarFileHash(user) : undefined
                        }
                    })
                }
            }
        })
        // 添加聯絡人
        this.registerEvent("User.addContact", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token', 'target'])) return {
                msg: "参数缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const user = User.findById(token.author) as User
            const chat = Chat.findById(args.target as string)
            const targetUser = User.findByAccount(args.target as string) as User
            if (chat)
                user!.addContact(chat.bean.id)
            else if (targetUser) {
                const privChat = ChatPrivate.findOrCreateForPrivate(user, targetUser)
                user!.addContact(privChat.bean.id)
            } else {
                return {
                    msg: "找不到目标",
                    code: 404,
                }
            }

            return {
                msg: "成功",
                code: 200,
            }
        })
        /*
         * ================================================
         *                    公開資料
         * ================================================
         */
        // 獲取用戶信息
        this.registerEvent("User.getInfo", (args, { deviceId }) => {
            if (this.checkArgsMissing(args, ['token', 'target'])) return {
                msg: "参数缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token, deviceId)) return {
                code: 401,
                msg: "令牌无效",
            }

            const user = User.findById(args.target as string)
            if (user == null) return {
                code: 404,
                msg: "用戶不存在",
            }

            return {
                msg: "成功",
                code: 200,
                data: {
                    username: user!.getUserName(),
                    nickname: user!.getNickName(),
                    avatar_file_hash: user!.getAvatarFileHash() ? user!.getAvatarFileHash() : null,
                    id: user.bean.id,
                }
            }
        })
    }
}