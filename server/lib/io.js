/* 
 * Simple File Access Library
 * Author - @MoonLeeeaf <https://github.com/MoonLeeeaf>
 */

import fs from 'node:fs'

/**
 * 简单文件类
 */
class io {
    /**
     * 构建函数
     * @param { String } path 
     * @param { String } mode 
     */
    constructor(path, mode) {
        this.path = path
        this.r = mode.includes('r')
        this.w = mode.includes('w')
    }
    /**
     * 构建函数
     * @param { String } path 
     * @param { String } mode 
     */
    static open(path, mode) {
        if (!mode || mode == '')
             throw new Error('当前文件对象未设置属性!')
        return new io(path, mode)
    }
    /**
     * 检测文件或目录是否存在
     * @param { String } path 
     * @returns { Boolean }
     */
    static exists(path) {
        return fs.existsSync(path)
    }
    /**
     * 枚举目录下所有文件
     * @param { String } 扫描路径 
     * @param { Function<String> } 过滤器<文件完整路径>
     * @param { Boolean } 是否搜索文件夹内的文件
     * @returns { String[] } 文件完整路径列表
     */
    static listFiles(path, filter, recursive) {
        let a = fs.readdirSync(path, { recursive: recursive })
        a.forEach(function(v, index, arrayThis) {
            arrayThis[index] = `${path}//${v}`
        })
        return a.filter(function(v) {
            if (!fs.lstatSync(v).isFile()) return false

            if (filter) return filter(v)
            return true
        })
    }
    /**
     * 枚举目录下所有文件夹
     * @param { String } 扫描路径 
     * @param { Function<String> } 过滤器<文件夹完整路径>
     * @param { Boolean } 是否搜索文件夹内的文件夹
     * @returns { String[] } 文件夹完整路径列表
     */
     static listFolders(path, filter, recursive) {
        let a = fs.readdirSync(path, { recursive: recursive })
        a.forEach(function(v, index, arrayThis) {
            arrayThis[index] = `${path}//${v}`
        })
        return a.filter(function(v) {
            if (!fs.lstatSync(v).isDirectory()) return false

            if (filter) return filter(v)
            return true
        })
    }
    /**
     * 获取文件(夹)的全名
     * @param { String } path 
     * @returns { String } name
     */
    static getName(path) {
        let r = /\\|\//
        let s = path.search(r)
        while (s != -1) {
            path = path.substring(s + 1)
            s = path.search(r)
        }
        return path
    }
    /**
     * 获取文件(夹)的父文件夹路径
     * @param { String } path 
     * @returns { String } parentPath
     */
     static getParent(path) {
        return path.substring(0, path.lastIndexOf(this.getName(path)) - 1)
    }
    /**
     * 复制某文件夹的全部内容, 自动创建文件夹
     * @param { String } from 
     * @param { String } to
     */
    static copyDir(from, to) {
        this.mkdirs(to)
        this.listFiles(from).forEach(function(v) {
            io.open(v, 'r').pipe(io.open(`${to}//${io.getName(v)}`, 'w')).close()
        })
        this.listFolders(from).forEach(function(v) {
            io.copyDir(v, `${to}//${io.getName(v)}`)
        })
    }
    /**
     * 删除文件
     * @param { String } path 
     */
    static remove(f) {
        fs.rmSync(f, { recursive: true })
    }
    /**
     * 移动文件
     * @param { String }} path 
     * @param { String } newPath 
     */
    static move(path, newPath) {
        fs.renameSync(path, newPath)
    }
    /**
     * 创建文件夹, 有则忽略
     * @param { String } path 
     * @returns { String } path
     */
    static mkdirs(path) {
        if (!this.exists(path))
            fs.mkdirSync(path, { recursive: true })
        return path
    }
    /**
     * 将文件内容写入到另一个文件
     * @param { io } file 
     * @returns { io } this
     */
    pipe(file) {
        file.writeAll(this.readAll())
        file.close()
        return this
    }
    /**
     * 检查文件是否存在, 若无则写入, 有则忽略
     * @param { Buffer | String } 写入数据
     * @returns { io } 对象自身
     */
    checkExistsOrWrite(data) {
        if (!io.exists(this.path))
            this.writeAll(data)
        return this
    }
    /**
     * 检查文件是否存在, 若无则写入 JSON 数据, 有则忽略
     * @param { Object } 写入数据
     * @returns { io } 对象自身
     */
    checkExistsOrWriteJson(data) {
        if (!io.exists(this.path))
            this.writeAllJson(data)
        return this
    }
    /**
     * 读取一个文件
     * @returns { Buffer } 文件数据字节
     */
    readAll() {
        if (this.r)
            return fs.readFileSync(this.path)
        throw new Error('当前文件对象未设置可读')
    }
    /**
     * 读取一个文件并关闭
     * @returns { Buffer } 文件数据
     */
    readAllAndClose() {
        let r
        if (this.r)
            r = this.readAll()
        else 
            throw new Error('当前文件对象未设置可读!')
        this.close()
        return r
    }
    /**
     * 写入一个文件
     * @param { Buffer | String } 写入数据
     * @returns { io } 对象自身
     */
    writeAll(data) {
        if (this.w)
            fs.writeFileSync(this.path, data)
        else
            throw new Error('当前文件对象未设置可写!')
        return this
    }
    /**
     * 写入一个JSON文件
     * @param { Object } 写入数据
     * @returns { io } 对象自身
     */
    writeAllJson(data) {
        if (!data instanceof Object)
            throw new Error('你只能输入一个 JSON 对象!')
        if (this.w)
            this.writeAll(JSON.stringify(data))
        else
            throw new Error('当前文件对象未设置可写!')
        return this
    }
    /**
     * 读取一个JSON文件
     * @returns { Object } 文件数据
     */
    readAllJson() {
        if (this.r)
            return JSON.parse(this.readAll().toString())
        throw new Error('当前文件对象未设置可读!')
    }
    /**
     * 读取一个JSON文件并关闭
     * @returns { Object } 文件数据
     */
    readAllJsonAndClose() {
        let r
        if (this.r)
            r = JSON.parse(this.readAll().toString())
        else 
            throw new Error('当前文件对象未设置可读!')
        this.close()
        return r
    }
    /**
     * 回收文件对象
     */
    close() {
        delete this.path
        delete this.r
        delete this.w
    }
}

export default io
