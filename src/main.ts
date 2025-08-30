import ApiManager from "./api/ApiManager.ts"
import express from 'express'
import SocketIo from 'socket.io'
import HttpServerLike from "./types/HttpServerLike.ts"
import config from './config.ts'
import http from 'node:http'
import https from 'node:https'

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
