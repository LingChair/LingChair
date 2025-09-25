import EventCallbackFunction from "../typedef/EventCallbackFunction.ts"
import ApiManager from "./ApiManager.ts"
import { CallMethod, ClientEvent } from './ApiDeclare.ts'
import User from "../data/User.ts"
import Token from "./Token.ts"
import TokenManager from './TokenManager.ts'
import * as SocketIo from "socket.io"

export default abstract class BaseApi {
    abstract getName(): string
    constructor() {
        this.onInit()
    }
    abstract onInit(): void
    checkArgsMissing(args: { [key: string]: unknown }, names: string[]) {
        for (const k of names)
            if (!(k in args))
                return true
        return false
    }
    checkArgsEmpty(args: { [key: string]: unknown }, names: string[]) {
        for (const k of names)
            if (k in args && args[k] == '')
                return true
        return false
    }
    checkToken(token: Token, deviceId: string) {
        return TokenManager.checkToken(token, deviceId)
    }
    registerEvent(name: CallMethod, func: EventCallbackFunction) {
        if (!name.startsWith(this.getName() + ".")) throw Error("注冊的事件應該與接口集合命名空間相匹配: " + name)
        ApiManager.addEventListener(name, func)
    }
    emitToClient(client: SocketIo.Socket, name: ClientEvent, args: { [key: string]: unknown }) {
        client.emit("The_White_Silk", name, args)
    }
}
