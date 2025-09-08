import HttpServerLike from '../typedef/HttpServerLike.ts'
import UserApi from "./UserApi.ts"
import * as SocketIo from "socket.io"
import ApiCallbackMessage from "./ApiCallbackMessage.ts"
import EventCallbackFunction from "../typedef/EventCallbackFunction.ts"
import BaseApi from "./BaseApi.ts"
import DataWrongError from "./DataWrongError.ts";
import chalk from "chalk";

export default class ApiManager {
    static httpServer: HttpServerLike
    static socketIoServer: SocketIo.Server
    static event_listeners: { [key: string]: EventCallbackFunction } = {}
    static apis_instance: { [key: string]: BaseApi } = {}
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
            socket.on("The_White_Silk", (name: string, args: { [key: string]: unknown }, callback_: (ret: ApiCallbackMessage) => void) => {
                function callback(ret: ApiCallbackMessage) {
                    console.log(chalk.blue('[發]') + ` ${socket.request.socket.remoteAddress} <- ${ret.code == 200 ? chalk.green(ret.msg) : chalk.red(ret.msg)} [${ret.code}]${ ret.data ? (' <extras: ' + JSON.stringify(ret.data) + '>') : ''}`)
                    return callback_(ret)
                }
                try {
                    if (name == null || args == null) return callback({
                        msg: "Invalid request.",
                        code: 400
                    })
                    console.log(chalk.red('[收]') + ` ${socket.request.socket.remoteAddress} -> ${chalk.yellow(name)} <args: ${JSON.stringify(args)}>`)

                    return callback(this.event_listeners[name]?.(args))
                } catch (e) {
                    const err = e as Error
                    console.log(chalk.yellow('[壞]') + ` ${err.message} (${err.stack})`)
                    try {
                        callback({
                            code: err instanceof DataWrongError ? 400 : 500,
                            msg: "錯誤: " + err.message
                        })
                    } catch(_e) {}
                }
            })
        })
    }
}
