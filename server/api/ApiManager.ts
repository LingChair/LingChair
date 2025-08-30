import HttpServerLike from '../types/HttpServerLike.ts'
import UserApi from "./UserApi.ts"
import * as SocketIo from "socket.io"
import ApiCallbackMessage from "../types/ApiCallbackMessage.ts"
import EventCallbackFunction from "../types/EventCallbackFunction.ts"

export default class ApiManager {
    static httpServer: HttpServerLike
    static socketIoServer: SocketIo.Server
    static event_listeners: { [key: string] : EventCallbackFunction } = {}
    static apis_instance: {}
    static initServer(httpServer: HttpServerLike, socketIoServer: SocketIo.Server) {
        this.httpServer = httpServer
        this.socketIoServer = socketIoServer
    }
    static getHttpServer() {
        return this.httpServer
    }
    static getSocketIoServer() {
        return this.socketIoServer
    }
    static initAllApis() {
        this.apis_instance = {
            user: new UserApi()
        }
    }
    static addEventListener(name: string, func: EventCallbackFunction) {
        this.event_listeners[name] = func
    }
    static initEvents() {
        const io = this.socketIoServer
        io.on('connection', (socket) => {
            socket.on("The_White_Silk", (name: string, args: {}, callback: (ret: ApiCallbackMessage) => void) => {
                if (name == null || args == null) return callback({
                    msg: "Invalid request.",
                    code: 400
                })

                return callback(this.event_listeners[name]?.(args))
            })
        })
    }
}
