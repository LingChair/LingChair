import ChatType from "./ChatType.ts"

export default class Chat {
    declare type: ChatType
    declare id: string
    declare title: string
    declare avatar?: string
    declare settings?: { [key: string]: unknown }

    [key: string]: unknown
}
