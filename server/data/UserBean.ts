export default class UserBean {
    declare count: number
    declare id: string
    declare password: string
    declare username?: string
    declare registered_time: number
    declare nickname: string
    declare avatar_file_hash?: string
    declare settings: string

    [key: string]: unknown
}
