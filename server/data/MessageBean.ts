export default class MessageBean {
    declare id: number
    declare text: string
    declare user_id?: string
    declare time: string

    [key: string]: unknown
}
