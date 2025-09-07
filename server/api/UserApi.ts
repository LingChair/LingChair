import BaseApi from "./BaseApi.ts"

export default class UserApi extends BaseApi {
    override getName(): string {
        return "User"
    }
    override onInit(): void {
        this.registerEvent("User.auth", (args) => {
            return {
                msg: "",
                code: 401,
            }
        })
        this.registerEvent("User.login", (args) => {
            if (this.checkArgsMissing(args, ['account', 'password'])) return {
                msg: "",
                code: 400,
            }

            return {
                msg: "",
                code: 501,
            }
        })
    }
}