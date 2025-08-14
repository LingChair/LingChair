import BaseApi from './BaseApi.ts'
import HttpServerLike from '../types/HttpServerLike.ts'

export default class ApiManager {
    declare httpServer: HttpServerLike
    static init(httpServer: HttpServerLike) {
        this.httpServer = httpServer
    }
    static getHttpServer() {
        return this.httpServer
    }
}
