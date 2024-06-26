/* 
 * ©2024 满月叶
 * GitHub @MoonLeeeaf
 * 辅助添加
 */

// 2024.5.28 睡着了
const sleep = (t) => new Promise((res) => setTimeout(res, t))

const UrlArgs = new URL(location.href).searchParams

// https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html
function isMobile() {
    return ('ontouchstart' in document.documentElement);
}

if (UrlArgs.get("debug")) {
    let script = document.createElement('script')
    script.src = "//cdn.jsdelivr.net/npm/eruda"
    document.body.appendChild(script)
    script.onload = () => eruda.init()
}

// 经常会因为这个指定ID为位置导致一些莫名BUG
if (location.href.includes("#")) location.replace(location.href.substring(0, location.href.indexOf("#")))

const mdui_snackbar = mdui.snackbar
mdui.snackbar = (m) => {
    let t = m
    if (m instanceof Object)
        t = JSON.stringify(m)
    mdui_snackbar(t)
}

const checkEmpty = (i) => {
    if (i instanceof Array) {
        for (let k of i) {
            if (checkEmpty(k)) return true
        }
    }

    return (i == null) || ("" === i) || (0 === i)
}

// AI的力量太强了
function getOffsetTop(parent, child) {
    let top = 0
    while (child && child !== parent) {
      top += child.offsetTop
      child = child.offsetParent
    }
    return top
  }  

function escapeHTML(str) {
    return str.replace(/[<>&"']/g, function (match) {
        switch (match) {
            case '<':
                return '&lt;'
            case '>':
                return '&gt;'
            case '&':
                return '&amp;'
            case '"':
                return '&quot;'
            case "'":
                return '&#39;'
            default:
                return match
        }
    })
}

class NData {
    /**
     * 获取 MD5sum
     * @param {String} 数据
     */
    static mount(node) {
        // 便捷获得指定组件
        let es = node.querySelectorAll("[n-id]")
        let ls = {}
        es.forEach((i) => ls[$(i).attr("n-id")] = $(i))

        // input 组件与 localStorage 绑定
        es = node.querySelectorAll("[n-input-ls]")
        es.forEach((e) => {
            let j = $(e)
            j.val(localStorage.getItem(j.attr("n-input-ls")))
            j.blur(() => localStorage.setItem(j.attr("n-input-ls"), j.val()))
        })
        return ls
    }
}

// https://www.runoob.com/w3cnote/javascript-copy-clipboard.html

/**
 * 复制文字
 * @param {String} 欲复制的文本
 */
function copyText(t) {
    let btn = $("[n-id=textCopierBtn]")
    btn.attr("data-clipboard-text", t)
    new ClipboardJS(btn.get(0)).on('success', (e) => {
        e.clearSelection()
    })
    btn.click()
}

// https://zhuanlan.zhihu.com/p/162910462

/**
 * 格式化日期
 * @param {int} 时间戳
 * @param {String} 欲格式化的文本
 * @returns {String} 格式后的文本
 */
Date.prototype.format = function (tms, format) {
    let tmd = new Date(tms)
    /*
     * 例子: format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": tmd.getMonth() + 1, // month
        "d+": tmd.getDate(), // day
        "h+": tmd.getHours(), // hour
        "m+": tmd.getMinutes(), // minute
        "s+": tmd.getSeconds(), // second
        "q+": Math.floor((tmd.getMonth() + 3) / 3), // quarter
        "S": tmd.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (tmd.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

// 既然已经有 Notification 了, 那用回中文也不过分吧 :)
class 通知 {
    constructor() {
        this.args = {}
        this.title = ""
    }
    static checkAvailable() {
        return ("Notification" in window)
    }
    static async request() {
        if (!this.checkAvailable()) return false
        return (await Notification.requestPermission())
    }
    setId(id) {
        this.args.tag = id
        return this
    }
    setTitle(t) {
        this.title = t
        return this
    }
    setMessage(m) {
        this.args.body = m
        return this
    }
    setIcon(i) {
        this.args.icon = i
        return this
    }
    setImage(i) {
        this.args.image = i
        return this
    }
    setData(data) {
        this.args.data = data
    }
    show(onclick/*, onclose*/) {
        if (!通知.checkAvailable()) return
        if (localStorage.useNotifications !== "true") return
        let n = new Notification(this.title, this.args)
        n.onclick = onclick == null ? () => n.close() : (n) => onclick(n)
        return n
    }
}

class Hash {
    /**
     * 获取 MD5sum
     * @param {String} 数据
     * @returns {String} Hex化的哈希值
     */
    static md5(data) {
        return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex)
    }
    /**
     * 获取 SHA256sum
     * @param {String} 数据
     * @returns {String} Hex化的哈希值
     */
    static sha256(data) {
        return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex)
    }
}

class CachedData {
    static cache = {}
    /**
     * 添加缓存对象
     * @param {Object} 欲缓存的对象
     * @returns {String} 该对象的ID
     */
    static addToList(obj) {
        let id = Hash.sha256(obj)
        this.cache[id] = obj
        return id
    }
    /**
     * 回收字符
     * @param {String} 该对象的ID 
     */
    static recycle(id) {
        this.cache[id] = null
    }
    /**
     * 根据ID获取文本
     * @param {String} 该对象的ID 
     * @returns {Object} 对象
     */
    static get(id) {
        return this.cache[id]
    }
    /**
     * 根据ID获取文本并回收
     * @param {String} 该文本的ID 
     * @returns {Object} 对象
     */
     static getAndRecycle(id) {
        let t = this.get(id)
        this.recycle(id)
        return t
    }
}

window.copyText = copyText
window.NData = NData
window.escapeHTML = escapeHTML
window.isMobile = isMobile
window.checkEmpty = checkEmpty
window.sleep = sleep 
window.Hash = Hash
window.通知 = 通知
window.CachedString = CachedData
