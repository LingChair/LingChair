/* 
 * ©2024 满月叶
 * GitHub @MoonLeeeaf
 * 界面逻辑
 */

$.ajax({
    url: "res/config.json",
    dataType: "json",
    success: (c) => {
        viewBinding.appTitle.text(c.appTitle)
        if (!c.canChangeServer) {
            viewBinding.dialogSignInServerLabel.hide()
            viewBinding.drawerChangeServer.hide()
        }
    },
})

// 关于页面
viewBinding.menuAbout.click(() => mdui.alert('为人民服务<br/>GitHub @MoonLeeeaf<br/>欢迎访问我们的<a class="mdui-text-color-theme" href="https://github.com/LingChair/LingChair">项目主页</a>', '关于 铃之椅', () => { }, { confirmText: "关闭" }))

viewBinding.drawerChangeServer.click(() => {
    mdui.prompt('输入服务器地址...(为空则使用当前地址)', (value) => {
        localStorage.server = value
        mdui.snackbar("更新成功, 刷新页面生效")
        new mdui.Dialog(viewBinding.dialogSettings.get(0)).open()
    }, () => {
        new mdui.Dialog(viewBinding.dialogSettings.get(0)).open()
    }, {
        confirmText: "确定",
        cancelText: "取消"
    })
})

viewBinding.settingsDialogSignOut.click(() => {
    mdui.confirm('确定要登出账号吗', () => {
        User.signOutAndReload()
    }, () => {
        new mdui.Dialog(viewBinding.dialogSettings.get(0)).open()
    }, {
        confirmText: "确定",
        cancelText: "取消"
    })
})

viewBinding.sendMsg.click((a) => {
    let text = viewBinding.inputMsg.val()
    if (text.trim() !== "")
        ChatPage.getCurrentChatPage().send(text)
})

viewBinding.inputMsg.keydown((e) => {
    if (e.ctrlKey && e.keyCode === 13)
        viewBinding.sendMsg.click()
})

viewBinding.dialogSignInPasswd.keydown((e) => {
    if (e.keyCode === 13)
        viewBinding.dialogSignInEnter.click()
})

viewBinding.switchNotifications.click((a) => {
    if ((localStorage.useNotifications == "true" || localStorage.useNotifications != null) && localStorage.useNotifications != "false") {
        localStorage.useNotifications = "false"
        viewBinding.switchNotificationsIcon.text("notifications_off")
    } else {
        localStorage.useNotifications = "true"
        viewBinding.switchNotificationsIcon.text("notifications")
    }
})
if (localStorage.useNotifications == "true")
    viewBinding.switchNotificationsIcon.text("notifications")

viewBinding.inputMsg.blur(() => {
    window.initInputResizerResize()
})
