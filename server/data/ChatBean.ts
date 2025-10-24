import ChatType from "./ChatType.ts"

export default class ChatBean {
    declare count: number
    declare type: ChatType
    declare id: string
    declare name?: string
    declare title?: string
    declare avatar_file_hash?: string
    declare members_list: string
    declare settings: string

    [key: string]: unknown
}
