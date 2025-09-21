import ApiCallbackMessage from "../api/ApiCallbackMessage.ts"

type EventCallbackFunction = (args: { [key: string]: unknown }, clientInfo: {
    userId: string
    deviceId: string
    ip: string
}) => ApiCallbackMessage

export default EventCallbackFunction
