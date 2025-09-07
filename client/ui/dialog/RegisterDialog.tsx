import * as React from 'react'
import { Button, Dialog, TextField } from "mdui";
import useEventListener from "../useEventListener.ts";
import Client from "../../api/Client.ts";
import { checkApiSuccessOrSncakbar, snackbar } from "../snackbar.ts";

import * as CryptoES from 'crypto-es'

interface Refs {
    loginInputAccountRef: React.MutableRefObject<TextField | null>
    loginInputPasswordRef: React.MutableRefObject<TextField | null>
    registerInputUserNameRef: React.MutableRefObject<TextField | null>
    registerInputNickNameRef: React.MutableRefObject<TextField | null>
    registerInputPasswordRef: React.MutableRefObject<TextField | null>
    registerDialogRef: React.MutableRefObject<Dialog | null>
}

export default function RegisterDialog({
    loginInputAccountRef,
    loginInputPasswordRef,
    registerInputUserNameRef,
    registerInputNickNameRef,
    registerInputPasswordRef,
    registerDialogRef
}: Refs) {
    const registerBackButtonRef: React.MutableRefObject<Button | null> = React.useRef(null)
    const doRegisterButtonRef: React.MutableRefObject<Button | null> = React.useRef(null)
    useEventListener(registerBackButtonRef, 'click', () => registerDialogRef.current!.open = false)
    useEventListener(doRegisterButtonRef, 'click', async () => {
        const username = registerInputUserNameRef.current!.value
        const re = await Client.invoke("User.register", {
            username: username,
            nickname: registerInputNickNameRef.current!.value,
            password: CryptoES.SHA256(registerInputPasswordRef.current!.value).toString(CryptoES.Hex),
        })

        if (checkApiSuccessOrSncakbar(re, "注冊失敗")) return
        loginInputAccountRef.current!.value = username == "" ? re.data!.userid as string : username
        loginInputPasswordRef.current!.value = registerInputPasswordRef.current!.value

        registerInputUserNameRef.current!.value = ""
        registerInputNickNameRef.current!.value = ""
        registerInputPasswordRef.current!.value = ""
        registerDialogRef.current!.open = false
        snackbar({
            message: "注冊成功!",
            placement: "top",
        })
    })
    return (
        <mdui-dialog headline="注冊" ref={registerDialogRef}>

            <mdui-text-field label="用戶名 (可選)" ref={registerInputUserNameRef}></mdui-text-field>
            <div style={{
                height: "10px",
            }}></div>
            <mdui-text-field label="昵稱" ref={registerInputNickNameRef}></mdui-text-field>
            <div style={{
                height: "10px",
            }}></div>
            <mdui-text-field label="密码" type="password" toggle-password ref={registerInputPasswordRef}></mdui-text-field>

            <mdui-button slot="action" variant="text" ref={registerBackButtonRef}>返回</mdui-button>
            <mdui-button slot="action" variant="text" ref={doRegisterButtonRef}>注冊</mdui-button>
        </mdui-dialog>
    )
}