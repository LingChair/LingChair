export default class MapJson {
    static replacer(key: unknown, value: unknown) {
        if (value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()), // or with spread: value: [...value]
            }
        } else {
            return value
        }
    }
    static reviver(key: unknown, value: any) {
        if (value?.dataType === 'Map') {
            return new Map(value.value)
        }
        return value
    }
}