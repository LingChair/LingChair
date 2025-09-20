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
import path from "node:path"

const app = express()
app.use('/', express.static(config.data_path + '/page_compiled'))
app.get('/uploaded_files/:hash', (req, res) => {
    const hash = req.params.hash as string
    if (hash == null) {
        res.sendStatus(404)
        res.send("404 Not Found")
        return
    }
    const file = FileManager.findByHash(hash)
    if (file == null) {
        res.sendStatus(404)
        res.send("404 Not Found")
        return
    }

    res.setHeader('Content-Type', file!.getMime())
    res.sendFile(path.resolve(file!.getFilePath()))
})

const httpServer: HttpServerLike = (
    ((config.server.use == 'http') && http.createServer(app)) ||
    ((config.server.use == 'https') && https.createServer(config.server.https, app)) ||
    http.createServer(app)
)
const io = new SocketIo.Server(httpServer, {
    maxHttpBufferSize: 1e9,
})

ApiManager.initServer(httpServer, io)
ApiManager.initEvents()
ApiManager.initAllApis()

httpServer.listen(config.server.listen)
console.log(chalk.green("API & Web 服務已經開始運作"))
function help() {
    console.log(chalk.yellow("===== TheWhiteSilk Server ====="))
    console.log(chalk.yellow("b - 重新編譯前端"))
}
help()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.on('line', (text) => {
    if (text == 'b') {
        console.log(chalk.green("重新編譯..."))
        child_process.spawnSync("deno", ["task", "build"], {
            stdio: [process.stdin, process.stdout, process.stderr]
        })
        console.log(chalk.green("✓ 編譯完畢"))
        help()
    }
})
