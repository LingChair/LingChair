import { React } from '../../Imports.ts'

export default function LoginDialog({
    inputAccountRef,
    inputPasswordRef,
    registerButtonRef,
    loginButtonRef,
    loginDialogRef
}) {
    return (
        <mdui-dialog headline="登录" ref={loginDialogRef}>

            <mdui-text-field label="账号" ref={inputAccountRef}></mdui-text-field>
            <div style={{
                height: "10px",
            }}></div>
            <mdui-text-field label="密码" ref={inputPasswordRef}></mdui-text-field>

            <mdui-button slot="action" variant="text" ref={registerButtonRef}>注册</mdui-button>
            <mdui-button slot="action" variant="text" ref={loginButtonRef}>登录</mdui-button>
        </mdui-dialog>
    )
}