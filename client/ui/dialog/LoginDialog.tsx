import * as React from 'react'
import { Button, Dialog, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoES from 'crypto-es'
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
    const loginButtonRef: React.MutableRefObject<Button | null> = React.useRef(null)
    const registerButtonRef: React.MutableRefObject<Button | null> = React.useRef(null)
    useEventListener(registerButtonRef, 'click', () => registerDialogRef.current!.open = true)
    useEventListener(loginButtonRef, 'click', async () => {
        const account = loginInputAccountRef.current!.value
        const password = loginInputPasswordRef.current!.value

        const re = await Client.invoke("User.login", {
            account: account,
            password: CryptoES.SHA256(password).toString(CryptoES.Hex),
        })

        if (checkApiSuccessOrSncakbar(re, "登錄失敗")) return

        data.access_token = re.data!.access_token as string
        location.reload()
    })
    return (
        <mdui-dialog headline="登錄" ref={loginDialogRef}>

            <mdui-text-field label="用戶 ID / 用戶名" ref={loginInputAccountRef}></mdui-text-field>
            <div style={{
                height: "10px",
            }}></div>
            <mdui-text-field label="密碼" type="password" toggle-password ref={loginInputPasswordRef}></mdui-text-field>

            <mdui-button slot="action" variant="text" ref={registerButtonRef}>注册</mdui-button>
            <mdui-button slot="action" variant="text" ref={loginButtonRef}>登录</mdui-button>
        </mdui-dialog>
    )
}