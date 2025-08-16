import BaseApi from './BaseApi.ts'
import HttpServerLike from '../types/HttpServerLike.ts'
import UserApi from "./UserApi.ts"
import SocketIo from "socket.io"

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
    static initAllApis() {
        this.apis_instance = {
            user: new UserApi()
        }
    }
}
