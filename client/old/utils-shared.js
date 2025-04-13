/* 
 * ©2024 The LingChair Project
 * 
 * Make a more colorful world...
 * 
 * License - Apache License 2.0
 * Author - @MoonLeeeaf <https://github.com/MoonLeeeaf>
 * Organization - @LingChair <https://github.com/LingChair>
 */

/**
 * ========================================================
 *                      移动端检测
 * ========================================================
 */

const isMobile = () => ('ontouchstart' in document.documentElement)

/**
 * ========================================================
 *                      移动端调试
 * ========================================================
 */

if (isMobile()) {
    let a = document.createElement('script')
    a.src = "https://unpkg.com/eruda/eruda.js"
    a.onload = () => eruda.init()
    document.head.appendChild(a)
}
