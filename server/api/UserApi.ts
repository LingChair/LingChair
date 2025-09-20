import { Buffer } from "node:buffer";
import User from "../data/User.ts";
import BaseApi from "./BaseApi.ts"
import TokenManager from "./TokenManager.ts";
import ChatPrivate from "../data/ChatPrivate.ts";
import Chat from "../data/Chat.ts";

export default class UserApi extends BaseApi {
    override getName(): string {
        return "User"
    }
    override onInit(): void {
        // 驗證
        this.registerEvent("User.auth", (args) => {
            if (this.checkArgsMissing(args, ['access_token'])) return {
                msg: "參數缺失",
                code: 400,
            }
            try {
                const access_token = TokenManager.decode(args.access_token as string)

                if (access_token.expired_time < Date.now()) return {
                    msg: "登錄令牌失效",
                    code: 401,
                }

                if (!User.findById(access_token.author)) return {
                    msg: "賬號不存在",
                    code: 401,
                }

                return {
                    msg: "成功",
                    code: 200,
                }
            } catch (e) {
                const err = e as Error
                if (err.message.indexOf("JSON") != -1)
                    return {
                        msg: "無效的登錄令牌",
                        code: 401,
                    }
                else
                    throw e
            }
        })
        // 登錄
        this.registerEvent("User.login", (args) => {
            if (this.checkArgsMissing(args, ['account', 'password'])) return {
                msg: "參數缺失",
                code: 400,
            }
            if (this.checkArgsEmpty(args, ['account', 'password'])) return {
                msg: "參數不得為空",
                code: 400,
            }

            const user = (User.findByUserName(args.account as string) || User.findById(args.account as string)) as User
            if (user == null) return {
                msg: "賬號或密碼錯誤",
                code: 400,
            }

            if (user.getPassword() == args.password) return {
                msg: "成功",
                code: 200,
                data: {
                    access_token: TokenManager.make(user)
                },
            }

            return {
                msg: "賬號或密碼錯誤",
                code: 400,
            }
        })
        // 注冊
        this.registerEvent("User.register", (args) => {
            if (this.checkArgsMissing(args, ['nickname', 'password'])) return {
                msg: "參數缺失",
                code: 400,
            }
            if (this.checkArgsEmpty(args, ['nickname', 'password'])) return {
                msg: "參數不得為空",
                code: 400,
            }

            const username: string | null = args.username as string
            const nickname: string = args.nickname as string
            const password: string = args.password as string

            const user = User.createWithUserNameChecked(username, password, nickname, null)

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
        this.registerEvent("User.setAvatar", (args) => {
            if (this.checkArgsMissing(args, ['avatar', 'token'])) return {
                msg: "參數缺失",
                code: 400,
            }
            if (!(args.avatar instanceof Buffer)) return {
                msg: "參數不合法",
                code: 400,
            }
            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
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
        this.registerEvent("User.updateProfile", (args) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
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
        this.registerEvent("User.getMyInfo", (args) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
            }

            const user = User.findById(token.author)

            return {
                msg: "成功",
                code: 200,
                data: {
                    username: user!.getUserName(),
                    nickname: user!.getNickName(),
                    avatar: user!.getAvatarFileHash() ? "uploaded_files/" + user!.getAvatarFileHash() : null,
                    id: token.author,
                }
            }
        })
        // 獲取聯絡人列表
        this.registerEvent("User.getMyContacts", (args) => {
            if (this.checkArgsMissing(args, ['token'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
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
                            title: chat?.getTitle(user) || "未知",
                            avatar: chat?.getAvatarFileHash(user) ? "uploaded_files/" + chat?.getAvatarFileHash(user) : undefined
                        }
                    })
                }
            }
        })
        // 添加聯絡人
        this.registerEvent("User.addContact", (args) => {
            if (this.checkArgsMissing(args, ['token', 'contact_chat_id'])) return {
                msg: "參數缺失",
                code: 400,
            }

            const token = TokenManager.decode(args.token as string)
            if (!this.checkToken(token)) return {
                code: 401,
                msg: "令牌無效",
            }

            const user = User.findById(token.author)
            user!.addContact(args.contact_chat_id as string)

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

    }
}