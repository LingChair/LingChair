// deno-lint-ignore-file ban-types

import http from "node:http"
import https from "node:https"
// @ts-types="npm:@types/express"
import express from "express"
// @ts-types="npm:socket.io"
import { Server as SocketIoServer } from "socket.io"

interface TheWhiteSilkParams {
    method: string
    args: object
}

interface TheWhiteSilkCallback {
    code: 200 | 400 | 401 | 403 | 404 | 500 | 501
    msg: string
}

interface ClientToServerEvents {
    the_white_silk: (arg: TheWhiteSilkParams, callback: (ret: TheWhiteSilkCallback) => void) => void
}

const useHttps = false

const app = express()
const httpApp = useHttps ? https.createServer(app) : http.createServer(app)
const sio = new SocketIoServer<
    ClientToServerEvents,
    {},
    {},
    {}
>(httpApp, {})

app.use("/", express.static("whitesilk_data/page_builded/"))

sio.on("connection", (socket) => {
    socket.on("the_white_silk", (params, callback) => {
        if ((params || callback) == null || typeof callback == "function") return
        
    })
})

httpApp.listen(80)
