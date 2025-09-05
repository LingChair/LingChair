import ApiCallbackMessage from "../api/ApiCallbackMessage.ts"

type EventCallbackFunction = (args: {}) => ApiCallbackMessage

export default EventCallbackFunction
