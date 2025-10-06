import * as React from 'react'
import { Button, Dialog, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoJS from 'crypto-js'
import data from "../../Data.ts";

interface Refs {
    loginInputAccountRef: React.MutableRefObject<TextField | null>
    loginInputPasswordRef: React.MutableRefObject<TextField | null>
    loginDialogRef: React.MutableRefObject<Dialog | null>
    registerDialogRef: React.MutableRefObject<Dialog | null>
}

export default function LoginDialog({
    loginInputAccountRef,
    loginInputPasswordRef,
    loginDialogRef,
    registerDialogRef
}: Refs) {
    const loginButtonRef = React.useRef<Button>(null)
    const registerButtonRef = React.useRef<Button>(null)
    useEventListener(registerButtonRef, 'click', () => registerDialogRef.current!.open = true)
    useEventListener(loginButtonRef, 'click', async () => {
        const account = loginInputAccountRef.current!.value
        const password = loginInputPasswordRef.current!.value

        const re = await Client.invoke("User.login", {
            account: account,
            password: CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex),
        })

        if (checkApiSuccessOrSncakbar(re, "登录失败")) return

        data.access_token = re.data!.access_token as string
        data.apply()
        location.reload()
    })
    return (
        <mdui-dialog headline="登录" ref={loginDialogRef}>

            <mdui-text-field label="用户 ID / 用户名" ref={loginInputAccountRef as any}></mdui-text-field>
            <div style={{
                height: "10px",
            }}></div>
            <mdui-text-field label="密码" type="password" toggle-password ref={loginInputPasswordRef as any}></mdui-text-field>

            <mdui-button slot="action" variant="text" ref={registerButtonRef}>注册</mdui-button>
            <mdui-button slot="action" variant="text" ref={loginButtonRef}>登录</mdui-button>
        </mdui-dialog>
    )
}