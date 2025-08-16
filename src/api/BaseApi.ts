import UnknownFunction from '../types/UnknownFunction.ts'

export default abstract class BaseApi {
    abstract getName(): string
    constructor() {
        this.onInit()
    }
    abstract onInit(): void
    registerEvent(name: string, func: UnknownFunction) {
        
    }
}
