import ApiCallbackMessage from "../api/ApiCallbackMessage.ts"
import * as SocketIo from "socket.io"

type EventCallbackFunction = (args: { [key: string]: unknown }, clientInfo: {
    userId: string
    deviceId: string
    ip: string
    socket: SocketIo.Socket<SocketIo.DefaultEventsMap, SocketIo.DefaultEventsMap, SocketIo.DefaultEventsMap, any>
}) => ApiCallbackMessage | Promise<ApiCallbackMessage>

export default EventCallbackFunction
