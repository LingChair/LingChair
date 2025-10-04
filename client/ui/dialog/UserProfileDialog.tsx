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
    openChatFragment: (id: string) => void
    user: User
}

export default function UserProfileDialog({
    userProfileDialogRef,
    openChatFragment,
    user
}: Refs) {
    return (
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
            }}></mdui-divider>

            <mdui-list>
                {/* <mdui-list-item icon="edit" rounded>设置备注</mdui-list-item> */}
                <mdui-list-item icon="chat" rounded onClick={async () => {
                    const re = await Client.invoke("Chat.getIdForPrivate", {
                        token: data.access_token,
                        target: user.id,
                    })
                    if (re.code != 200)
                        return checkApiSuccessOrSncakbar(re, '获取对话失败')
                    
                    openChatFragment(re.data!.chat_id as string)
                    userProfileDialogRef.current!.open = false
                }}>对话</mdui-list-item>
            </mdui-list>
        </mdui-dialog>
    )
}