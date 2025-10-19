export default class JoinRequest {
    declare user_id: string
    declare title: string
    declare avatar?: string
    declare reason?: string

    [key: string]: unknown
}
