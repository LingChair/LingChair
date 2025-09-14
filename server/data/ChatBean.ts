export default class ChatBean {
    declare type: "paivate" | "group"
    declare id: string
    declare title?: string
    declare avatar_file_hash?: string
    declare user_a_id?: string
    declare user_b_id?: string
    declare settings: string

    [key: string]: unknown
}
