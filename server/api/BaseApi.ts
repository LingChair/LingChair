import EventCallbackFunction from "../typedef/EventCallbackFunction.ts"
import ApiManager from "./ApiManager.ts"
import { CallMethod } from './ApiDeclare.ts'

export default abstract class BaseApi {
    abstract getName(): string
    constructor() {
        this.onInit()
    }
    abstract onInit(): void
    checkArgsMissing(args: { [key: string]: unknown }, names: string[]) {
        for (const k of names)
            if (!(k in args))
                return true
        return false
    }
    registerEvent(name: CallMethod, func: EventCallbackFunction) {
        if (!name.startsWith(this.getName() + ".")) throw Error("注冊的事件應該與接口集合命名空間相匹配: " + name)
        ApiManager.addEventListener(name, func)
    }
}
