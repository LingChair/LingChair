import io from '../lib/io.js';
import { sha256 } from '../lib/crypto.js'

const baseDir = 'whitesilk_data/chat'
io.mkdirs(baseDir)

export class ChatManager {
    /**
     * 获取私聊实例 (双方可对调)
     * @param { String } a 用户A 的 ID
     * @param { String } b 用户B 的 ID
     * @returns { Chat } 
     */
    static getPrivateChat(a, b) {
        let id = sha256([
            a,
            b,
        ].sort().join())
        io.mkdirs(`${baseDir}/${id}`)
        let chat = new Chat(id)
        chat.id = id
        chat.updateInfo()
        return chat
    }
}

export class Chat {
    constructor(id) {
        if (!io.exists(`${baseDir}/${id}`)) throw new Error(`聊天 [id=${id}]不存在!`)

        // 尽管所有的键都是 undefined 但是仍然是键哦
        for (let k of Object.keys(this)) {
            this[k] = io.open(`${baseDir}/${id}/${k}`, 'rw').checkExistsOrWrite('').readAllAndClose().toString()
        }
    }
    updateInfo() {
        // 尽管所有的键都是 undefined 但是仍然是键哦
        for (let k of Object.keys(this)) {
            io.open(`${baseDir}/${this.id}/${k}`, 'w').writeAll((this[k] || '') + '').close()
        }
        // 防止服务端错误修改此值 主要是都是属性了再搞特殊对待很麻烦的
        io.open(`${baseDir}/${this.id}/id`, 'w').writeAll(this.id + '').close()
    }
    /** 
     * 聊天 ID
     * @type { String }
     */
    id
}

export class ChatApi {
    static createUser() {

    }
}
