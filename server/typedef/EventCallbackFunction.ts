import ApiCallbackMessage from "../api/ApiCallbackMessage.ts"

type EventCallbackFunction = (args: { [key: string]: unknown }) => ApiCallbackMessage

export default EventCallbackFunction
