import * as React from 'react'
import { Button, Dialog, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar, snackbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoJS from 'crypto-js'
import data from "../../Data.ts"
import EventBus from "../../EventBus.ts"

interface Refs {
    addContactDialogRef: React.MutableRefObject<Dialog | null>
}

export default function AddContactDialog({
    addContactDialogRef,
}: Refs) {
    const inputUserAccountRef = React.useRef<TextField>(null)
    return (
        <mdui-dialog close-on-overlay-click close-on-esc headline="添加對話" ref={addContactDialogRef}>
            現階段只支持添加用戶, 對話敬請期待...
            <mdui-text-field style={{ marginTop: "10px", }} label="對方的 用戶 ID / 用戶名" ref={inputUserAccountRef as any}></mdui-text-field>
            <mdui-button slot="action" variant="text" onClick={() => addContactDialogRef.current!.open = false}>取消</mdui-button>
            <mdui-button slot="action" variant="text" onClick={async () => {
                const re = await Client.invoke("User.addContact", {
                    account: inputUserAccountRef.current!.value,
                    token: data.access_token,
                })
        
                if (checkApiSuccessOrSncakbar(re, "添加失敗")) return
                snackbar({
                    message: "添加成功!",
                    placement: "top",
                })
                EventBus.emit('ContactsList.updateContacts')
                
                addContactDialogRef.current!.open = false
            }}>添加</mdui-button>
        </mdui-dialog>
    )
}