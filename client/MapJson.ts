// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map

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