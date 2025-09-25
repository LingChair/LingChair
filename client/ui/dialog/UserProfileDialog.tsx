import * as React from 'react'
import { Button, Dialog, TextField, dialog } from "mdui"
import useEventListener from "../useEventListener.ts"
import { checkApiSuccessOrSncakbar, snackbar } from "../snackbar.ts"
import Client from "../../api/Client.ts"

import * as CryptoJS from 'crypto-js'
import data from "../../Data.ts"
import Avatar from "../Avatar.tsx"
import User from "../../api/client_data/User.ts"

interface Refs {
    userProfileDialogRef: React.MutableRefObject<Dialog>
    user: User
}

export default function UserProfileDialog({
    userProfileDialogRef,
    user
}: Refs) {
    const isMySelf = Client.myUserProfile?.id == user?.id

    const editAvatarButtonRef = React.useRef<HTMLElement>(null)
    const chooseAvatarFileRef = React.useRef<HTMLInputElement>(null)
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

    const userProfileEditDialogRef = React.useRef<Dialog>(null)
    const editNickNameRef = React.useRef<TextField>(null)
    const editUserNameRef = React.useRef<TextField>(null)

    return (<>
        {
            // 公用 - 資料卡
        }
        <mdui-dialog close-on-overlay-click close-on-esc ref={userProfileDialogRef}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Avatar src={user?.avatar} text={user?.nickname} style={{
                    width: '50px',
                    height: '50px',
                }} />
                <span style={{
                    marginLeft: "15px",
                    fontSize: '16.5px',
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
                        <mdui-list-item icon="edit" rounded onClick={() => userProfileEditDialogRef.current!.open = true}>編輯資料</mdui-list-item>
                        {/*
                        <mdui-list-item icon="settings" rounded>賬號設定</mdui-list-item>
                        <mdui-list-item icon="lock" rounded>隱私設定</mdui-list-item>
                        */}
                        <mdui-divider style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                        }}></mdui-divider>
                        <mdui-list-item icon="logout" rounded onClick={() => dialog({
                            headline: "退出登錄",
                            description: "確定要退出登錄嗎? (若您的賬號未設定 用戶名, 請無務必複製 用戶 ID, 以免丟失賬號!)",
                            actions: [
                                {
                                    text: "取消",
                                    onClick: () => {
                                        return true
                                    },
                                },
                                {
                                    text: "確定",
                                    onClick: () => {
                                        data.access_token = ''
                                        data.apply()
                                        location.reload()
                                        return true
                                    },
                                }
                            ],
                        })}>退出登錄</mdui-list-item>
                    </>
                }
            </mdui-list>
        </mdui-dialog>
        {
            // 個人資料編輯
        }
        <mdui-dialog close-on-overlay-click close-on-esc ref={userProfileEditDialogRef}>
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
                <mdui-text-field variant="outlined" placeholder="昵稱" ref={editNickNameRef as any} style={{
                    marginLeft: "15px",
                }} value={user?.nickname}></mdui-text-field>
            </div>
            <mdui-divider style={{
                marginTop: "10px",
            }}></mdui-divider>

            <mdui-text-field style={{ marginTop: "10px", }} variant="outlined" label="用戶 ID" value={user?.id || ''} readonly onClick={(e) => {
                const input = e.target as HTMLInputElement
                input.select()
                input.setSelectionRange(0, 1145141919810)
            }}></mdui-text-field>
            <mdui-text-field style={{ marginTop: "20px", }} variant="outlined" label="用戶名" value={user?.username || ''} ref={editUserNameRef as any}></mdui-text-field>

            <mdui-button slot="action" variant="text" onClick={() => userProfileEditDialogRef.current!.open = false}>取消</mdui-button>
            <mdui-button slot="action" variant="text" onClick={async () => {
                const re = await Client.invoke("User.updateProfile", {
                    token: data.access_token,
                    nickname: editNickNameRef.current?.value,
                    username: editUserNameRef.current?.value,
                })

                if (checkApiSuccessOrSncakbar(re, "修改失敗")) return
                snackbar({
                    message: "修改成功 (刷新頁面以更新)",
                    placement: "top",
                })
                userProfileEditDialogRef.current!.open = false
            }}>更新</mdui-button>
        </mdui-dialog>
    </>)
}