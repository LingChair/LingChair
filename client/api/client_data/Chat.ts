import ChatType from "./ChatType.ts"

export default class Chat {
    declare type: ChatType
    declare id: string
    declare title: string
    declare avatar?: string

    [key: string]: unknown
}
