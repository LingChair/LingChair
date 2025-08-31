import ApiManager from "./api/ApiManager.ts"
// @ts-types="npm:@types/express"
import express from 'express'
import * as SocketIo from 'socket.io'
import HttpServerLike from "./types/HttpServerLike.ts"
import config from './config.ts'
import http from 'node:http'
import https from 'node:https'
import transform from './compiler/transform.ts'

const app = express()
app.use((req, res, next) => {
    const url = req.originalUrl || req.url
    if (/\.(j|t)sx?$/.test(url))
        res.setHeader('Content-Type', 'application/javascript')
    next()
})
app.use('/', express.static(config.data_path + '/page_compiled'))

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

transform('./client', config.data_path + '/page_compiled')
