import { io, Socket } from 'https://unpkg.com/socket.io-client@4.8.1/dist/socket.io.esm.min.js'
import { CallMethod } from './ApiDeclare.ts'
import ApiCallbackMessage from './ApiCallbackMessage.ts'

class Client {
    static socket: Socket
    static connect() {
        this.socket && this.socket.disconnect()
        this.socket = io()
    }
    static call(method: CallMethod, args: {}, timeout: number = 5000) {
        return new Promise((resolve, reject) => {
            this.socket.timeout().emit("The_White_Silk", (err, res: ApiCallbackMessage) => {
                if (err) return reject(err)
                
            })
        })
    }
}

export default Client
