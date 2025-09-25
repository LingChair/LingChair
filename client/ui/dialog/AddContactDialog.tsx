import * as React from 'react'
import { Button, Dialog, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoJS from 'crypto-js'
import data from "../../Data.ts"

interface Refs {
    addContactDialogRef: React.MutableRefObject<Dialog | null>
}

export default function AddContactDialog({
    addContactDialogRef,
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

        if (checkApiSuccessOrSncakbar(re, "登錄失敗")) return

        data.access_token = re.data!.access_token as string
        data.apply()
        location.reload()
    })
    return (
        <mdui-dialog headline="添加對話" ref={addContactDialogRef}>

            <mdui-text-field label="用戶 ID / 用戶名" ref={loginInputAccountRef as any}></mdui-text-field>
            <div style={{
                height: "10px",
            }}></div>
            <mdui-text-field label="密碼" type="password" toggle-password ref={loginInputPasswordRef as any}></mdui-text-field>

            <mdui-button slot="action" variant="text" onClick={() => addContactDialogRef.current!.open = false}>取消</mdui-button>
            <mdui-button slot="action" variant="text">添加</mdui-button>
        </mdui-dialog>
    )
}