import TokenType from "./TokenType.ts"

export default interface Token {
    author: string
    auth: string
    made_time: number
    expired_time: number
    device_id: string
    type: TokenType
}