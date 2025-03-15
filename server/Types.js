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
        static PERMISSION_DENIED = 4
        /**
         * 服务端错误
         */
        static SERVER_ERROR = 5
        /**
         * 请求成功
         */
        static OK = 2
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
