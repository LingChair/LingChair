import UnknownFunction from '../types/UnknownFunction.ts'
import ApiManager from "./ApiManager.ts";

export default abstract class BaseApi {
    abstract getName(): string
    constructor() {
        this.onInit()
    }
    abstract onInit(): void
    registerEvent(name: string, func: UnknownFunction) {
        const io = ApiManager.getSocketIoServer()
        
    }
}
