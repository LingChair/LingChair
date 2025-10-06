import { io, Socket } from 'socket.io-client'
import { CallMethod, ClientEvent, CallableMethodBeforeAuth } from './ApiDeclare.ts'
import ApiCallbackMessage from './ApiCallbackMessage.ts'
import User from "./client_data/User.ts"
import data from "../Data.ts"
import { checkApiSuccessOrSncakbar } from "../ui/snackbar.ts"
import randomUUID from "../randomUUID.ts"

class Client {
    static sessionId = randomUUID()
    static myUserProfile?: User
    static socket?: Socket
    static events: { [key: string]: ((data: unknown) => void)[] } = {}
    static connected = false
    static connect() {
        if (data.device_id == null)
            data.device_id = randomUUID()
        this.socket?.disconnect()
        this.socket && delete this.socket
        this.socket = io({
            transports: ['websocket'],
            auth: {
                device_id: data.device_id,
                session_id: this.sessionId,
            },
        })
        this.socket!.on("connect", async () => {
            const re = await this.invoke("User.auth", {
                access_token: data.access_token
            }, 1000)
            if (re.code != 200)
                checkApiSuccessOrSncakbar(re, "重連失敗")
            this.connected = true
        })
        this.socket!.on("disconnect", () => {
            this.connected = false
        })
        this.socket!.on("The_White_Silk", (name: string, data: unknown, callback: (ret: unknown) => void) => {
            try {
                if (name == null || data == null) return
                this.events[name]?.forEach((v) => v(data))
            } catch (e) {
                console.error(e)
            }
        })
    }
    static invoke(method: CallMethod, args: unknown = {}, timeout: number = 5000): Promise<ApiCallbackMessage> {
        if (this.socket == null || (!this.connected && !CallableMethodBeforeAuth.includes(method))) {
            return new Promise((reslove) => {
                setTimeout(async () => reslove(await this.invoke(method, args, timeout)), 500)
            })
        }
        return new Promise((resolve) => {
            this.socket!.timeout(timeout).emit("The_White_Silk", method, args, async (err: Error, res: ApiCallbackMessage) => {
                if (err) return resolve({
                    code: -1,
                    msg: err.message.indexOf("timed out") != -1 ? "請求超時" : err.message,
                })
                if (res.code == 401) {
                    const token = await this.refreshAccessToken()
                    if (token) {
                        data.access_token = token
                        data.apply()
                        resolve(await this.invoke(method, {
                            ...args,
                            token
                        }, timeout))
                    } else
                        resolve(res)
                } else
                    resolve(res)
            })
        })
    }
    static async refreshAccessToken() {
        const re = await this.invoke("User.refreshAccessToken", {
            refresh_token: data.refresh_token 
        })
        return re.data?.access_token
    }
    static async auth(token: string, timeout: number = 5000) {
        const re = await this.invoke("User.auth", {
            access_token: token
        }, timeout)
        if (re.code == 200) {
            await this.updateCachedProfile()
            document.cookie = 'token=' + token
            document.cookie = 'device_id=' + data.device_id
        }
        return re
    }
    static async updateCachedProfile() {
        this.myUserProfile = (await Client.invoke("User.getMyInfo", {
            token: data.access_token
        })).data as unknown as User
    }
    static on(eventName: ClientEvent, func: (data: unknown) => void) {
        if (this.events[eventName] == null)
            this.events[eventName] = []
        if (this.events[eventName].indexOf(func) == -1)
            this.events[eventName].push(func)
    }
    static off(eventName: ClientEvent, func: (data: unknown) => void) {
        if (this.events[eventName] == null)
            this.events[eventName] = []
        const index = this.events[eventName].indexOf(func)
        if (index != -1)
            this.events[eventName].splice(index, 1)
    }
}

export default Client
