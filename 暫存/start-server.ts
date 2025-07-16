import './compile-webpage.ts'

import {
    expressApp,
    httpServer,
    SocketIoServer,
} from './server/http.ts'

httpServer.listen(8080)

console.log("TheWhiteSilk server started successfully")
