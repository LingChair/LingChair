import EventCallbackFunction from "../types/EventCallbackFunction.ts"
import ApiManager from "./ApiManager.ts";

export default abstract class BaseApi {
    abstract getName(): string
    constructor() {
        this.onInit()
    }
    abstract onInit(): void
    registerEvent(name: string, func: EventCallbackFunction) {
        ApiManager.addEventListener(this.getName() + "." + name, func)
    }
}
