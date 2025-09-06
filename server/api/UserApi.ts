import BaseApi from "./BaseApi.ts"

export default class UserApi extends BaseApi {
    override getName(): string {
        return "User"
    }
    override onInit(): void {
        this.registerEvent("User.auth", (args) => {
            return {
                msg: "",
                code: 200,
                data: {
                    
                }
            }
        })
    }
}