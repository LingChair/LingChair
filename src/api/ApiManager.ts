import BaseApi from './BaseApi.ts'
import HttpServerLike from '../types/HttpServerLike.ts'
import UserApi from "./UserApi.ts"
import SocketIo from "socket.io"
import UnknownFunction from "../types/UnknownFunction.ts";

export default class ApiManager {
    static httpServer: HttpServerLike
    static socketIoServer: SocketIo.Server
    static apis_instance: {}
    static init(httpServer: HttpServerLike, socketIoServer: SocketIo.Server) {
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
    static initEvents() {
        const io = this.socketIoServer
        io.on('connection', (socket) => {
            socket.on("The_White_Silk", (name: string, args: {}, callback: UnknownFunction) => {
                if (name == null || args == null) return callback({
                    
                })
            })
        })
    }
}
