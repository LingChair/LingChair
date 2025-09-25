export default class EventBus {
    static events: { [key: string]: () => void } = {}
    static on(eventName: string, func: () => void) {
        this.events[eventName] = func
    }
    static off(eventName: string) {
        delete this.events[eventName]
    }
    static emit(eventName: string) {
        this.events[eventName]()
    }
}