import ApiCallbackMessage from "../api/ApiCallbackMessage.ts"

type EventCallbackFunction = (args: { [key: string]: unknown }, client: { deviceId: string }) => ApiCallbackMessage

export default EventCallbackFunction
