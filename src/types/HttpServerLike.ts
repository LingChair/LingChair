import http from 'node:http'
import https from 'node:https'

export type HttpServerLike = http.Server | https.Server
