import crypto from 'node:crypto'

/**
 * 获取 Sha-256 哈希
 * @param { crypto.BinaryLike } data 
 * @returns 
 */
export function sha256(data) {
    return crypto.createHash('sha256').update(data).digest().toString('hex')
}
