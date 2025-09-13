import * as React from 'react'
import { Button, Dialog, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar, snackbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoJS from 'crypto-js'
import data from "../../Data.ts"
import Avatar from "../Avatar.tsx"
import User from "../../api/client_data/User.ts"

interface Refs {
    userProfileDialogRef: React.MutableRefObject<Dialog | null>
    user: User
}

export default function UserProfileDialog({
    userProfileDialogRef,
    user
}: Refs) {
    const isMySelf = Client.myUserProfile?.id == user?.id

    const editAvatarButtonRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null)
    const chooseAvatarFileRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)
    useEventListener(editAvatarButtonRef, 'click', () => chooseAvatarFileRef.current!.click())
    useEventListener(chooseAvatarFileRef, 'change', async (_e) => {
        const file = chooseAvatarFileRef.current!.files?.[0] as File
        if (file == null) return

        const re = await Client.invoke("User.setAvatar", {
            token: data.access_token,
            avatar: file
        })

        if (checkApiSuccessOrSncakbar(re, "修改失敗")) return
        snackbar({
            message: "修改成功 (刷新頁面以更新)",
            placement: "top",
        })
    })

    return (
        <mdui-dialog close-on-overlay-click close-on-esc ref={userProfileDialogRef}>
            <div style={{
                display: "none"
            }}>
                <input type="file" name="選擇頭像" ref={chooseAvatarFileRef}
                    accept="image/*" />
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Avatar src={user?.avatar} text={user?.nickname} avatarRef={editAvatarButtonRef} style={{
                    width: '50px',
                    height: '50px',
                }} />
                <span style={{
                    marginLeft: "10px",
                    fontSize: '15.5px',
                }}>{user?.nickname}</span>
            </div>
            <mdui-divider style={{
                marginTop: "10px",
                marginBottom: "10px",
            }}></mdui-divider>

            <mdui-list>
                {!isMySelf && <mdui-list-item icon="edit" rounded>編輯聯絡人訊息</mdui-list-item>}
                {
                    isMySelf && <>
                        <mdui-list-item icon="edit" rounded>編輯資料</mdui-list-item>
                        <mdui-list-item icon="settings" rounded>賬號設定</mdui-list-item>
                        <mdui-list-item icon="lock" rounded>隱私設定</mdui-list-item>
                    </>
                }
            </mdui-list>
        </mdui-dialog>
    )
}