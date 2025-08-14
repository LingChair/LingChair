import UnknownFunction from '../types/UnknownFunction.ts'

export default abstract class BaseApi {
    abstract getName(): string
    constructor() {
        this.init()
    }
    abstract init(): void
    registerEvent(name: string, func: UnknownFunction) {
        
    }
}
