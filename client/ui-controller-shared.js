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
 *                         窗口大小
 * ========================================================
 */

// 在窗口加载完毕后会将所有页面大小变化的回调都调用一次
const windowOnResizingCallbacks = []

function updateWindowSize() {
    document.body.style.setProperty('--window-width', `${window.innerWidth}px`)
    document.body.style.setProperty('--window-height', `${window.innerHeight}px`)
    windowOnResizingCallbacks.forEach((v) => v(window.innerWidth, window.innerHeight))
}
window.addEventListener('resize', updateWindowSize)
// 初步确定(值有偏差)
$(() => updateWindowSize())
// 完全确定(值已经确定)
window.addEventListener('load', updateWindowSize)

/**
 * ========================================================
 *                  Shadow 元素辅助代码
 * ========================================================
 */

// 将组件添加到影子DOM中
$(() => $('* > shadow-inner').each((_i, v) => {
    $(v.parentElement.shadowRoot).append(v.children)
    v.parentNode.removeChild(v)
}))
