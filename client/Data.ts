// @ts-types="npm:@types/crypto-js"
import * as CryptoJS from 'crypto-js'

const dataIsEmpty = !localStorage.tws_data || localStorage.tws_data == ''

const aes = {
    enc: (data: string, key: string) => CryptoJS.AES.encrypt(data, key).toString(),
    dec: (data: string, key: string) => CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8),
}

const key = location.host + '_TWS_姐姐'

if (dataIsEmpty) localStorage.tws_data = aes.enc('{}', key)

let _dec = aes.dec(localStorage.tws_data, key)
if (_dec == '') _dec = '{}'

const _data_cached = JSON.parse(_dec)

// 類型定義
declare global {
    interface Window {
        data: {
            split_sizes: number[]
            apply(): void
            access_token?: string
            device_id: string
        }
    }
}

// deno-lint-ignore no-window
(window.data == null) && (window.data = new Proxy({
    apply() {}
}, {
    get(_obj, k) {
        if (k == '_cached') return _data_cached
        if (k == 'apply') return () => localStorage.tws_data = aes.enc(JSON.stringify(_data_cached), key)
        return _data_cached[k]
    },
    set(_obj, k, v) {
        if (k == '_cached') return false
        _data_cached[k] = v
        return true
    }
}))

// deno-lint-ignore no-window
export default window.data
