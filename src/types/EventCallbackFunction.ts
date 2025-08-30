import ApiCallbackMessage from "./ApiCallbackMessage.ts"

type EventCallbackFunction = (args: {}) => ApiCallbackMessage

export default EventCallbackFunction
