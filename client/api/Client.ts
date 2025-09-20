import { io, Socket } from 'socket.io-client'
import { CallMethod, ClientEvent } from './ApiDeclare.ts'
import ApiCallbackMessage from './ApiCallbackMessage.ts'
import User from "./client_data/User.ts"
import data from "../Data.ts";

type UnknownObject = { [key: string]: unknown }

class Client {
    static myUserProfile?: User
    static socket?: Socket
    static events: { [key: string]: (data: UnknownObject) => UnknownObject } = {}
    static connect() {
        this.socket?.disconnect()
        this.socket && delete this.socket
        this.socket = io({
            transports: ['websocket']
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
        if (this.socket == null) {
            return new Promise((reslove) => {
                setTimeout(async () => reslove(await this.invoke(method, args, timeout)), 500)
            })
        }
        return new Promise((resolve, reject) => {
            this.socket!.timeout(timeout).emit("The_White_Silk", method, args, (err: string, res: ApiCallbackMessage) => {
                if (err) return reject(err)
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
    static on(eventName: ClientEvent, func: (data: UnknownObject) => UnknownObject) {
        this.events[eventName] = func
    }
    static off(eventName: ClientEvent) {
        delete this.events[eventName]
    }
}

export default Client
