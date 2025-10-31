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
import chalk from "chalk"
import child_process from "node:child_process"
import FileManager from "./data/FileManager.ts"
import TokenManager from "./api/TokenManager.ts"
import UserChatLinker from "./data/UserChatLinker.ts"
import path from "node:path"
import cookieParser from 'cookie-parser'
import fs from 'node:fs/promises'

const app = express()
app.use('/', express.static(config.data_path + '/page_compiled'))
app.use(cookieParser())
app.get('/uploaded_files/:hash', (req, res) => {
    const hash = req.params.hash as string
    res.setHeader('Content-Type', 'text/plain')
    if (hash == null) {
        res.status(404).send("404 Not Found")
        return
    }
    const file = FileManager.findByHash(hash)

    if (file == null) {
        res.status(404).send("404 Not Found")
        return
    }

    if (file.getChatId() != null) {
        const userToken = TokenManager.decode(req.headers['token'] || req.cookies.token)
        if (!TokenManager.checkToken(userToken, req.headers['device_id'] || req.cookies.device_id)) {
            res.status(401).send("401 UnAuthorized")
            return
        }
        if (!UserChatLinker.checkUserIsLinkedToChat(userToken.author, file.getChatId() as string)) {
            res.status(403).send("403 Forbidden")
            return
        }
    }

    const fileName = encodeURIComponent(file!.getName()?.replaceAll('"', ''))
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
    res.setHeader('Content-Type', file!.getMime())
    res.sendFile(path.resolve(file!.getFilePath()))
})

const httpServer: HttpServerLike = (
    ((config.server.use == 'http') && http.createServer(app)) ||
    ((config.server.use == 'https') && https.createServer({
        ...config.server.https,
        key: await fs.readFile(config.server.https.key),
        cert: await fs.readFile(config.server.https.cert),
    }, app)) ||
    http.createServer(app)
)
const io = new SocketIo.Server(httpServer, {
    maxHttpBufferSize: 1e114514,
})

ApiManager.initServer(httpServer, io)
ApiManager.initEvents()
ApiManager.initAllApis()

httpServer.listen(config.server.listen)
console.log(chalk.green("API & Web 服务已启动"))
function help() {
    console.log(chalk.yellow("===== LingChair Server ====="))
    console.log(chalk.yellow("b - 重新编译前端"))
}
help()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.on('line', (text) => {
    if (text == 'b') {
        console.log(chalk.green("重新编译..."))
        child_process.spawnSync("deno", ["task", "build"], {
            stdio: [process.stdin, process.stdout, process.stderr]
        })
        help()
    }
})
