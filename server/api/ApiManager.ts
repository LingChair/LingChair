import HttpServerLike from '../typedef/HttpServerLike.ts'
import UserApi from "./UserApi.ts"
import ChatApi from "./ChatApi.ts"
import * as SocketIo from "socket.io"
import ApiCallbackMessage from "./ApiCallbackMessage.ts"
import EventCallbackFunction from "../typedef/EventCallbackFunction.ts"
import BaseApi from "./BaseApi.ts"
import DataWrongError from "./DataWrongError.ts"
import chalk from "chalk"

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
            user: new UserApi(),
            chat: new ChatApi(),
        }
    }
    static addEventListener(name: string, func: EventCallbackFunction) {
        this.event_listeners[name] = func
    }
    static clients: { [key: string]: string[] } = {}
    static checkUserIsOnline(userId: string, deviceId: string) {
        return this.clients[userId].includes(deviceId)
    }
    static initEvents() {
        const io = this.socketIoServer

        io.on('connection', (socket) => {
            // TODO: fix ip == undefined
            // https://github.com/denoland/deno/blob/7938d5d2a448b876479287de61e9e3b8c6109bc8/ext/node/polyfills/net.ts#L1713
            const ip = socket.conn.remoteAddress

            const deviceId = socket.handshake.auth.device_id as string

            const clientInfo = {
                userId: '',
                deviceId,
                ip
            }

            socket.on('disconnect', (_reason) => {
                if (clientInfo.userId == '')
                    console.log(chalk.yellow('[斷]') + ` ${ip} disconnected`)
                else {
                    console.log(chalk.green('[斷]') + ` ${ip} disconnected`)
                    const ls = this.clients[clientInfo.userId]
                    ls.splice(ls.indexOf(deviceId))
                }
            })
            console.log(chalk.yellow('[連]') + ` ${ip} connected`)

            socket.on("The_White_Silk", (name: string, args: { [key: string]: unknown }, callback_: (ret: ApiCallbackMessage) => void) => {
                function callback(ret: ApiCallbackMessage) {
                    console.log(chalk.blue('[發]') + ` ${ip} <- ${ret.code == 200 ? chalk.green(ret.msg) : chalk.red(ret.msg)} [${ret.code}]${ret.data ? (' <extras: ' + JSON.stringify(ret.data) + '>') : ''}`)
                    return callback_(ret)
                }
                try {
                    if (name == null || args == null) return callback({
                        msg: "Invalid request.",
                        code: 400
                    })
                    console.log(chalk.red('[收]') + ` ${ip} -> ${chalk.yellow(name)} <args: ${JSON.stringify(args)}>`)

                    return callback(this.event_listeners[name]?.(args, clientInfo) || {
                        code: 501,
                        msg: "Not implmented",
                    })
                } catch (e) {
                    const err = e as Error
                    console.log(chalk.yellow('[壞]') + ` ${err.message} (${err.stack})`)
                    try {
                        callback({
                            code: err instanceof DataWrongError ? 400 : 500,
                            msg: "錯誤: " + err.message
                        })
                    } catch (_e) { }
                }
            })
        })
    }
}
