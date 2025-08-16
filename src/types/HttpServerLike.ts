import http from 'node:http'
import https from 'node:https'

type HttpServerLike = http.Server | https.Server

export default HttpServerLike
