/* 
 * ©2024 The LingChair Project
 * 
 * Make a more colorful world...
 * 
 * License - Apache License 2.0
 * Author - @MoonLeeeaf <https://github.com/MoonLeeeaf>
 * Organization - @LingChair <https://github.com/LingChair>
 */

import io from './libraries/iolib.js'

let vals = {}

// 配置目录
vals.LINGCHAIR_CONFIG_DIR = "ling_chair_data"
// HTTP 服务器资源目录
vals.LINGCHAIR_HTTP_DIR = "ling_chair_http"
// 服务端配置
vals.LINGCHAIR_SERVER_CONFIG_FILE = vals.LINGCHAIR_CONFIG_DIR + "/server.json"

// 主要数据目录
vals.LINGCHAIR_DATA_DIR = "ling_chair_data"

// 用户数据
vals.LINGCHAIR_USERS_DATA_DIR = vals.LINGCHAIR_DATA_DIR + "/users"
// 用户头像
vals.LINGCHAIR_USERS_HEAD_DIR = vals.LINGCHAIR_DATA_DIR + "/users_head"

// 群聊消息
vals.LINGCHAIR_GROUP_MESSAGE_DIR = vals.LINGCHAIR_DATA_DIR + "/messages/group"
// 单聊消息
vals.LINGCHAIR_SINGLE_MESSAGE_DIR = vals.LINGCHAIR_DATA_DIR + "/messages/single"

// 用户 ID 计次
vals.LINGCHAIR_USERS_COUNT_FILE = vals.LINGCHAIR_USERS_DATA_DIR + "/count.txt"

// 创建必备目录
io.mkdirs(vals.LINGCHAIR_CONFIG_DIR)
io.mkdirs(vals.LINGCHAIR_USERS_DATA_DIR)
io.mkdirs(vals.LINGCHAIR_USERS_HEAD_DIR)
io.mkdirs(vals.LINGCHAIR_GROUP_MESSAGE_DIR)
io.mkdirs(vals.LINGCHAIR_SINGLE_MESSAGE_DIR)

// 生成服务端配置文件
io.open(vals.LINGCHAIR_SERVER_CONFIG_FILE, "w").checkExistsOrWriteJson({
    useHttps: false,
    port: 3601,
    bindAddress: "0.0.0.0",
    https: {
        key: "",
        cert: "",
    },
}).close()

io.open(vals.LINGCHAIR_USERS_COUNT_FILE, "w").checkExistsOrWrite("10000").close()

/**
 * 服务端配置文件
 * @type { {useHttps: false,port: 3601,bindAddress: "0.0.0.0",https: {key: "",cert: ""}} }
 */
vals.LINGCHAIR_SERVER_CONFIG = io.open(vals.LINGCHAIR_SERVER_CONFIG_FILE, "r").readAllJsonAndClose()

export default vals
