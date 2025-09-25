import Client from "../api/Client.ts"
import data from "../Data.ts"
import ChatFragment from "./chat/ChatFragment.tsx"
import useEventListener from './useEventListener.ts'
import User from "../api/client_data/User.ts"
import RecentChat from "../api/client_data/RecentChat.ts"
import Avatar from "./Avatar.tsx"

import * as React from 'react'
import { Dialog, NavigationRail, TextField } from "mdui"
import Split from 'split.js'
import 'mdui/jsx.zh-cn.d.ts'
import { checkApiSuccessOrSncakbar } from "./snackbar.ts"

import RegisterDialog from "./dialog/RegisterDialog.tsx"
import LoginDialog from "./dialog/LoginDialog.tsx"
import UserProfileDialog from "./dialog/UserProfileDialog.tsx"
import ContactsList from "./main/ContactsList.tsx"
import RecentsList from "./main/RecentsList.tsx"
import useAsyncEffect from "./useAsyncEffect.ts"
import ChatInfoDialog from "./dialog/ChatInfoDialog.tsx";
import Chat from "../api/client_data/Chat.ts";

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicAttributes {
                id?: string
                slot?: string
            }
        }
    }
}

export default function App() {
    const [recentsList, setRecentsList] = React.useState([] as RecentChat[])

    const [navigationItemSelected, setNavigationItemSelected] = React.useState('Recents')

    const navigationRailRef = React.useRef<NavigationRail>(null)
    useEventListener(navigationRailRef, 'change', (event) => {
        setNavigationItemSelected((event.target as HTMLElement as NavigationRail).value as string)
    })

    const loginDialogRef = React.useRef<Dialog>(null)
    const loginInputAccountRef = React.useRef<TextField>(null)
    const loginInputPasswordRef = React.useRef<TextField>(null)

    const registerDialogRef = React.useRef<Dialog>(null)
    const registerInputUserNameRef = React.useRef<TextField>(null)
    const registerInputNickNameRef = React.useRef<TextField>(null)
    const registerInputPasswordRef = React.useRef<TextField>(null)

    const userProfileDialogRef = React.useRef<Dialog>(null)
    const openMyUserProfileDialogButtonRef = React.useRef<HTMLElement>(null)
    useEventListener(openMyUserProfileDialogButtonRef, 'click', (_event) => {
        userProfileDialogRef.current!.open = true
    })

    const chatInfoDialogRef = React.useRef<Dialog>(null)
    const [chatInfo, setChatInfo] = React.useState(null as unknown as Chat)

    const [myUserProfileCache, setMyUserProfileCache] = React.useState(null as unknown as User)

    const [isShowChatFragment, setIsShowChatFragment] = React.useState(false)

    const [currentChatId, setCurrentChatId] = React.useState('')

    useAsyncEffect(async () => {
        const split = Split(['#SideBar', '#ChatFragment'], {
            sizes: data.split_sizes ? data.split_sizes : [25, 75],
            minSize: [200, 400],
            gutterSize: 2,
            onDragEnd: function () {
                data.split_sizes = split.getSizes()
                data.apply()
            }
        })

        Client.connect()
        const re = await Client.auth(data.access_token || "")
        if (re.code == 401)
            loginDialogRef.current!.open = true
        else if (re.code != 200) {
            if (checkApiSuccessOrSncakbar(re, "驗證失敗")) return
        } else if (re.code == 200) {
            setMyUserProfileCache(Client.myUserProfile as User)
        }
    })

    return (
        <div style={{
            display: "flex",
            position: 'relative',
            width: 'calc(var(--whitesilk-window-width) - 80px)',
            height: 'var(--whitesilk-window-height)',
        }}>
            <LoginDialog
                loginDialogRef={loginDialogRef}
                loginInputAccountRef={loginInputAccountRef}
                loginInputPasswordRef={loginInputPasswordRef}
                registerDialogRef={registerDialogRef} />

            <RegisterDialog
                registerDialogRef={registerDialogRef}
                registerInputUserNameRef={registerInputUserNameRef}
                registerInputNickNameRef={registerInputNickNameRef}
                registerInputPasswordRef={registerInputPasswordRef}
                loginInputAccountRef={loginInputAccountRef}
                loginInputPasswordRef={loginInputPasswordRef} />

            <UserProfileDialog
                userProfileDialogRef={userProfileDialogRef as any}
                user={myUserProfileCache} />

            <ChatInfoDialog
                chatInfoDialogRef={chatInfoDialogRef as any}
                openChatFragment={(id) => {
                    setCurrentChatId(id)
                    setIsShowChatFragment(true)
                }}
                chat={chatInfo} />

            <mdui-navigation-rail contained value="Recents" ref={navigationRailRef}>
                <mdui-button-icon slot="top">
                    <Avatar src={myUserProfileCache?.avatar} text={myUserProfileCache?.nickname} avatarRef={openMyUserProfileDialogButtonRef} />
                </mdui-button-icon>

                <mdui-navigation-rail-item icon="watch_later--outlined" active-icon="watch_later--filled" value="Recents"></mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="chat--outlined" active-icon="chat--filled" value="Contacts"></mdui-navigation-rail-item>

                <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
            </mdui-navigation-rail>
            {
                // 侧边列表
            }
            <div id="SideBar">
                {
                    // 最近聊天
                    <RecentsList
                        openChatFragment={(id) => {
                            setCurrentChatId(id)
                            setIsShowChatFragment(true)
                        }}
                        display={navigationItemSelected == "Recents"}
                        currentChatId={currentChatId}
                        recentsList={recentsList}
                        setRecentsList={setRecentsList} />
                }
                {
                    // 對話列表
                    <ContactsList
                        setChatInfo={setChatInfo}
                        chatInfoDialogRef={chatInfoDialogRef as any}
                        display={navigationItemSelected == "Contacts"} />
                }
            </div>
            {
                // 聊天页面
            }
            <div id="ChatFragment" style={{
                display: "flex",
                width: '100%'
            }}>
                {
                    !isShowChatFragment && <div style={{
                        width: '100%',
                        textAlign: 'center',
                        alignSelf: 'center',
                    }}>
                        選擇以開始對話...
                    </div>
                }
                {
                    isShowChatFragment && <ChatFragment
                        target={currentChatId}
                        key={currentChatId} />
                }
            </div>
        </div>
    )
}