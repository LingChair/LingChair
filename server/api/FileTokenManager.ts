import { Buffer } from "node:buffer"
import config from "../config.ts"
import User from "../data/User.ts"
import crypto from 'node:crypto'
import Token from "./Token.ts"

function normalizeKey(key: string, keyLength = 32) {
    const hash = crypto.createHash('sha256')
    hash.update(key)
    const keyBuffer = hash.digest()
    return keyLength ? keyBuffer.slice(0, keyLength) : keyBuffer
}

export default class FileTokenManager {
    static makeAuth(user: User) {
        return crypto.createHash("sha256").update(user.bean.id + user.getPassword() + config.salt + '_file').digest().toString('hex')
    }
    static encode(token: Token) {
        return crypto.createCipheriv("aes-256-gcm", normalizeKey(config.aes_key + '_file'), '01234567890123456').update(
            JSON.stringify(token)
        ).toString('hex')
    }
    static decode(token: string) {
        if (token == null) throw new Error('令牌為空!')
        return JSON.parse(crypto.createDecipheriv("aes-256-gcm", normalizeKey(config.aes_key + '_file'), '01234567890123456').update(
            Buffer.from(token, 'hex')
        ).toString()) as Token
    }

    /**
     * 簽發文件令牌
     */
    static make(user: User, device_id: string) {
        const time = Date.now()
        return this.encode({
            author: user.bean.id,
            auth: this.makeAuth(user),
            made_time: time,
            // 過期時間: 2分鐘
            expired_time: time + (1 * 1000 * 60 * 2),
            device_id: device_id
        })
    }
    /**
     * 校驗文件令牌
     */
    static check(user: User, token: string) {
        const tk = this.decode(token)

        return (
            this.makeAuth(user) == tk.auth
            && tk.expired_time < Date.now()
        )
    }
}
