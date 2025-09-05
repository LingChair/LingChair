const dataIsEmpty = !localStorage.tws_data || localStorage.tws_data == ''

const aes = {
    enc: (m: string, k: string) => CryptoJS.AES.encrypt(m, k).toString(),
    dec: (m: string, k: string) => CryptoJS.AES.decrypt(m, k).toString(CryptoJS.enc.Utf8),
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
            apply: () => void
            access_token?: string
        }
    }
}

// deno-lint-ignore no-window
(window.data == null) && (window.data = new Proxy({
    apply() {
        localStorage.tws_data = aes.enc(JSON.stringify(_data_cached), key)
    }
}, {
    get(_obj, k) {
        return _data_cached[k]
    },
    set(_obj, k, v) {
        _data_cached[k] = v
        return true
    },
}))

// deno-lint-ignore no-window
export default window.data
