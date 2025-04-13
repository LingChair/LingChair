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
 *                     侧边导航栏列表
 * ========================================================
 */

// 按钮:查看详细列表
$('#switch-navigation-list-info-menuicon').parent().click(() => {
    let list = $('#nav-list-information-dialog > mdui-list').empty()
    let selected = $('#switch-navigation-list-menu').get(0).value
    $('#main-navigation-list-' + selected + " > main-navigation-item").each((_i, e) => {
        let i = $.parseHTML(`<mdui-list-item rounded></mdui-list-item>`)
        let a = $.parseHTML(`<mdui-avatar slot="icon"></mdui-avatar>`)
        let img = new Image()
        img.style.cssText = `width: 100%; height: 100%; object-fit: contain;`
        img.src = e.getAttribute('img')
        img.onerror = () => {
            $(a).text((e.getAttribute('text') || '').substring(0, 1))
        }
        $(a).append(img)
        $(i).append(e.getAttribute('text'))
        $(i).append(a)
        list.append(i)
    })
    $('#nav-list-information-dialog').attr('headline', (function () {
        let t
        switch (selected + '') {
            case "1":
                t = '最近'
                break;
            case "2":
                t = '联系人'
                break;
            case "3":
                t = '群组'
                break;
        }
        return t
    })())
    $('#nav-list-information-dialog').attr('open', true)
})

// 切换列表选项
let lastValue = $('#switch-navigation-list-menu').get(0).value
$('#switch-navigation-list-menu').on('change', (e) => {
    // 当前选择的值
    let value = e.target.value

    // 特殊:详细列表
    if (value == 0) {
        // 选回原来的选项
        e.target.value = lastValue
        value = lastValue
        $('#switch-navigation-list-menu > mdui-menu-item[value=' + value + ']').get(0).selected = true
        $('#switch-navigation-list-menu > mdui-menu-item[value=0]').get(0).selected = false
        // 错误示范: 在这里写点击事件
    }

    // 禁止空选择
    if (value == null) {
        e.target.value = lastValue
        value = lastValue
        $('#switch-navigation-list-menu > mdui-menu-item[value=' + value + ']').get(0).selected = true
    }

    // 显示指定的列表
    $('#main-navigation-list-1').hide()
    $('#main-navigation-list-2').hide()
    $('#main-navigation-list-3').hide()
    $('#main-navigation-list-' + value).show()

    // 修改图标
    let icon = (function () {
        let ico
        switch (value + '') {
            case "1":
                ico = 'watch_later--outlined'
                break;
            case "2":
                ico = 'contacts--outlined'
                break;
            case "3":
                ico = 'group--outlined'
                break;
        }
        return ico
    })()
    $('#switch-navigation-list-button').attr('icon', icon)
    $('#switch-navigation-list-info-menuicon').attr('name', icon)

    // 更新最后的值用以防止空选择
    lastValue = value
})

// 最开始只选择 最近, 隐藏其他列表
$('#main-navigation-list-2').hide()
$('#main-navigation-list-3').hide()

// 子项目被点击时
$('mdui-navigation-rail').on('click', (event) => {
    let e = event.target
    let tagName = e.tagName.toLowerCase()
    while (tagName != 'main-navigation-item') {
        e = e.parentNode
        tagName = (e.tagName || 'mdui-navigation-rail').toLowerCase()
        if (tagName == 'mdui-navigation-rail') return
    }
    // 获取到Item

})

/**
 * ========================================================
 *                      输入框与消息编辑
 * ========================================================
 */

windowOnResizingCallbacks.push((w, h) => {
    $('#input_message').width(w - ($('mdui-navigation-rail').width() + $('#send_message').width() * 2 + 100))
})

/**
 * ========================================================
 *                        消息列表
 * ========================================================
 */

function scrollMessageHolderToBottom() {
    window.scrollBy({
        top: 1145141919810,
        behavior: "smooth",
    })
}

/**
 * ========================================================
 *                      图片查看对话框
 * ========================================================
 */

function openImageViewer(src) {
    $('#image-viewer-dialog-inner').empty()

    let e = new Image()
    e.src = src
    e.onerror = () => {
        $('#image-viewer-dialog-inner').empty()
        $('#image-viewer-dialog-inner').append($.parseHTML(`<mdui-icon name="broken_image" style="font-size: 2rem;"></mdui-icon>`))
    }
    $('#image-viewer-dialog-inner').append(e)

    e.onload = () => $('#image-viewer-dialog-inner').get(0).setTransform({
        scale: 0.6,
        x: $(window).width() / 2 - (e.width / 4),
        y: $(window).height() / 2 - (e.height / 3),
    })
    $('#image-viewer-dialog').get(0).open = true
}

/**
 * ========================================================
 *                           下载
 * ========================================================
 */

async function downloadFromUrl(src) {
    let re = await fetch(src)
    let blob = await re.blob()
    let url = URL.createObjectURL(blob)
    $('#download-helper').attr('download', url).attr('href', url).get(0).click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
}

/**
 * ========================================================
 *                           杂项
 * ========================================================
 */

// mdui.setColorScheme("#FFB4AA")
