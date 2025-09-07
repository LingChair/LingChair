import * as React from 'react'
import { Button, Dialog, TextField } from "mdui";

interface Refs {
    inputAccountRef: React.MutableRefObject<TextField | null>
    inputPasswordRef: React.MutableRefObject<TextField | null>
    registerButtonRef: React.MutableRefObject<Button | null>
    loginButtonRef: React.MutableRefObject<Button | null>
    loginDialogRef: React.MutableRefObject<Dialog | null>
}

export default function LoginDialog({
    inputAccountRef,
    inputPasswordRef,
    registerButtonRef,
    loginButtonRef,
    loginDialogRef
}: Refs) {
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