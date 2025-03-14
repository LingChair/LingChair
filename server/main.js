import http from 'node:http'
// import https from 'node:https' // 暂时
import express from 'express'
import { Server as SocketIoServer } from 'socket.io'

const app = express()
const httpApp = http.createServer(app)
const io = new SocketIoServer(httpApp, {})

class ThewhiteSilkParams {
    /**
     * @type { String }
     */
    method
    /**
     * @type { Object }
     */
    args
}

const events = []
import { UserApi } from './api/User.js'

for (let i of [
    UserApi
]) {
    for (let i2 of Object.keys(i)) {
        events.push(i[i2])
    }
}

io.on("connection", (socket) => {
    socket.on('the_white_silk',
        /** 
         * @param { ThewhiteSilkParams } params
         * @param { Function } callback
         */
        (params, callback) => {
            if ((params || callback) == null) return;
            
        }
    )
})

httpApp.listen(80)
