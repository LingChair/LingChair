import * as React from 'react'
import { Button, Dialog, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar, snackbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoJS from 'crypto-js'
import data from "../../Data.ts"
import EventBus from "../../EventBus.ts"

interface Refs {
    createGroupDialogRef: React.MutableRefObject<Dialog | null>
}

export default function CreateGroupDialog({
    createGroupDialogRef,
}: Refs) {
    const inputGroupNameRef = React.useRef<TextField>(null)
    const inputGroupIdRef = React.useRef<TextField>(null)

    async function createGroup() {
        const re = await Client.invoke("Chat.createGroup", {
            title: inputGroupNameRef.current!.value,
            id: inputGroupIdRef.current!.value,
            token: data.access_token,
        })

        if (checkApiSuccessOrSncakbar(re, "添加失敗")) return
        snackbar({
            message: "创建成功!",
            placement: "top",
        })
        EventBus.emit('ContactsList.updateContacts')

        inputGroupNameRef.current!.value = ''
        inputGroupIdRef.current!.value = ''
        createGroupDialogRef.current!.open = false
    }

    return (
        <mdui-dialog close-on-overlay-click close-on-esc headline="创建群组" ref={createGroupDialogRef}>
            <mdui-text-field clearable label="群组名称" ref={inputGroupNameRef as any} onKeyDown={(event) => {
                if (event.key == 'Enter')
                    inputGroupIdRef.current!.click()
            }}></mdui-text-field>
            <mdui-text-field style={{ marginTop: "10px", }} clearable label="群组 ID (可选)" ref={inputGroupIdRef as any} onKeyDown={(event) => {
                if (event.key == 'Enter')
                    createGroup()
            }}></mdui-text-field>
            <mdui-button slot="action" variant="text" onClick={() => createGroupDialogRef.current!.open = false}>取消</mdui-button>
            <mdui-button slot="action" variant="text" onClick={() => createGroup()}>创建</mdui-button>
        </mdui-dialog>
    )
}