import ApiManager from "./api/ApiManager.ts"
// @ts-types="npm:@types/express"
import express from 'express'
import * as SocketIo from 'socket.io'
import HttpServerLike from "./typedef/HttpServerLike.ts"
import config from './config.ts'
import http from 'node:http'
import https from 'node:https'
import readline from 'node:readline'
import process from "node:process"
import transform from './compiler/transform.ts'
import chalk from "chalk"

const app = express()
app.use((req, res, next) => {
    const url = req.originalUrl || req.url
    if (/\.m?(j|t)sx?$/.test(url))
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
console.log(chalk.green("API & Web 服務已經開始運作"))

console.log(chalk.green("Web 頁面已編譯完成, 用時 " + await transform('./client', config.data_path + '/page_compiled') + "s"))

console.log(chalk.yellow("===== TheWhiteSilk Server ====="))
console.log(chalk.yellow("b - 重新編譯 Web 頁面"))

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async (text) => {
    if (text == "b")
        console.log(chalk.green("Web 頁面已編譯完成, 用時 " + await transform('./client', config.data_path + '/page_compiled') + "s"))
})
