import { io, Socket } from 'socket.io-client'
import { CallMethod, ClientEvent, CallableMethodBeforeAuth } from './ApiDeclare.ts'
import ApiCallbackMessage from './ApiCallbackMessage.ts'
import User from "./client_data/User.ts"
import data from "../Data.ts"
import { checkApiSuccessOrSncakbar } from "../ui/snackbar.ts"
import randomUUID from "../randomUUID.ts"

type UnknownObject = { [key: string]: unknown }

class Client {
    static sessionId = randomUUID()
    static myUserProfile?: User
    static socket?: Socket
    static events: { [key: string]: (data: UnknownObject) => UnknownObject | void } = {}
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
        this.socket!.on("The_White_Silk", (name: string, data: UnknownObject, callback: (ret: UnknownObject) => void) => {
            try {
                if (name == null || data == null) return
                const re = this.events[name]?.(data)
                re && callback(re)
            } catch (e) {
                console.error(e)
            }
        })
    }
    static invoke(method: CallMethod, args: UnknownObject = {}, timeout: number = 5000): Promise<ApiCallbackMessage> {
        if (this.socket == null || (!this.connected && !CallableMethodBeforeAuth.includes(method))) {
            return new Promise((reslove) => {
                setTimeout(async () => reslove(await this.invoke(method, args, timeout)), 500)
            })
        }
        return new Promise((resolve) => {
            this.socket!.timeout(timeout).emit("The_White_Silk", method, args, (err: Error, res: ApiCallbackMessage) => {
                if (err) return resolve({
                    code: -1,
                    msg: err.message.indexOf("timed out") != -1 ? "請求超時" : err.message,
                })
                resolve(res)
            })
        })
    }
    static async auth(token: string, timeout: number = 5000) {
        const re = await this.invoke("User.auth", {
            access_token: token
        }, timeout)
        if (re.code == 200)
            await this.updateCachedProfile()
        return re
    }
    static async updateCachedProfile() {
        this.myUserProfile = (await Client.invoke("User.getMyInfo", {
            token: data.access_token
        })).data as unknown as User
    }
    static on(eventName: ClientEvent, func: (data: UnknownObject) => UnknownObject | void) {
        this.events[eventName] = func
    }
    static off(eventName: ClientEvent) {
        delete this.events[eventName]
    }
}

export default Client
