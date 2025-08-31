import { io, Socket } from 'https://unpkg.com/socket.io-client@4.8.1/dist/socket.io.esm.min.js'

class Client {
    static socket: Socket
    static connect() {
        this.socket && this.socket.disconnect()
        this.socket = io()
    }
}

export default Client
