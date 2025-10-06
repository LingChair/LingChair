import { Buffer } from "node:buffer"
import config from "../config.ts"
import User from "../data/User.ts"
import crypto from 'node:crypto'
import Token from "./Token.ts"
import TokenType from "./TokenType.ts"

function normalizeKey(key: string, keyLength = 32) {
    const hash = crypto.createHash('sha256')
    hash.update(key)
    const keyBuffer = hash.digest()
    return keyLength ? keyBuffer.slice(0, keyLength) : keyBuffer
}

export default class TokenManager {
    // TODO: 單令牌 -》 單 + 刷新 with 多設備管理
    static makeAuth(user: User) {
        return crypto.createHash("sha256").update(user.bean.id + user.getPassword() + config.salt).digest().toString('hex')
    }
    static encode(token: Token) {
        return crypto.createCipheriv("aes-256-gcm", normalizeKey(config.aes_key), '01234567890123456').update(
            JSON.stringify(token)
        ).toString('hex')
    }
    static decode(token: string) {
        try {
            return JSON.parse(crypto.createDecipheriv("aes-256-gcm", normalizeKey(config.aes_key), '01234567890123456').update(
                Buffer.from(token, 'hex')
            ).toString()) as Token
        } catch(e) {
            return {} as Token
        }
    }

    static make(user: User, time_: number | null | undefined, device_id: string, type: TokenType = "access_token") {
        const time = (time_ || Date.now())
        return this.encode({
            author: user.bean.id,
            auth: this.makeAuth(user),
            made_time: time,
            expired_time: time + (type == 'access_token' ? (1000 * 60 * 60 * 2) : (40 * 1000 * 60 * 60 * 24)),
            device_id: device_id,
            type
        })
    }
    /**
     * 嚴格檢驗令牌: 時間, 用戶, (設備 ID)
     */
    static checkToken(token: Token, deviceId?: string, type: TokenType = 'access_token') {
        if (token.expired_time < Date.now()) return false
        if (!token.author || !User.findById(token.author)) return false
        if (deviceId != null)
            if (token.device_id != deviceId)
                return false
        if (token.type != type)
            return false
        return true
    }
}
