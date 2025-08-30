import ApiManager from "./api/ApiManager.ts"
import express from 'express'
import * as SocketIo from 'socket.io'
import HttpServerLike from "./types/HttpServerLike.ts"
import config from './config.ts'
import http from 'node:http'
import https from 'node:https'
import web_packer from './web_packer.ts'

const app = express()
const httpServer: HttpServerLike = (
    ((config.server.use == 'http') && http.createServer(app)) || 
    ((config.server.use == 'https') && https.createServer(config.server.https, app)) || 
    http.createServer(app)
)
const io = new SocketIo.Server(httpServer, {
    
})

ApiManager.initServer(httpServer, io)
ApiManager.initEvents()
ApiManager.initAllApis()

httpServer.listen(config.server.listen)

web_packer?.run((err, status) => {
    if (err) throw err
    console.log("前端頁面已編譯完成")
    web_packer?.close(() => {})
})
