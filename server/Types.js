export class TheWhiteSilkParams {
    /**
     * @type { String }
     */
    method
    /**
     * @type { Object }
     */
    args
}

export class CallbackMessage {
    static Code = class {
        /**
         * 无权限
         */
        static PERMISSION_DENIED = 401
        /**
         * 不存在
         */
         static NOT_FOUND = 404
        /**
         * 服务端错误
         */
        static SERVER_ERROR = 500
        /**
         * 请求成功
         */
        static OK = 200
    }
    /**
     * @type { String }
     */
    msg
    /**
     * @type { Number }
     */
    code
}
