import Client from "../api/Client.ts"
import data from "../Data.ts"
import ChatFragment from "./chat/ChatFragment.tsx"
import useEventListener from './useEventListener.ts'
import User from "../api/client_data/User.ts"
import RecentChat from "../api/client_data/RecentChat.ts"
import Avatar from "./Avatar.tsx"

import * as React from 'react'
import { Dialog, NavigationBar, TextField } from "mdui"
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

export default function AppMobile() {
    const [recentsList, setRecentsList] = React.useState([] as RecentChat[])

    const [navigationItemSelected, setNavigationItemSelected] = React.useState('Recents')

    const navigationBarRef = React.useRef<NavigationBar>(null)
    useEventListener(navigationBarRef, 'change', (event) => {
        setNavigationItemSelected((event.target as HTMLElement as NavigationBar).value as string)
    })

    const loginDialogRef = React.useRef<Dialog>(null)
    const loginInputAccountRef = React.useRef<TextField>(null)
    const loginInputPasswordRef = React.useRef<TextField>(null)

    const registerDialogRef = React.useRef<Dialog>(null)
    const registerInputUserNameRef = React.useRef<TextField>(null)
    const registerInputNickNameRef = React.useRef<TextField>(null)
    const registerInputPasswordRef = React.useRef<TextField>(null)

    const userProfileDialogRef = React.useRef<Dialog>(null)

    const chatInfoDialogRef = React.useRef<Dialog>(null)
    const [chatInfo, setChatInfo] = React.useState(null as unknown as Chat)

    const [myUserProfileCache, setMyUserProfileCache] = React.useState(null as unknown as User)

    const [isShowChatFragment, setIsShowChatFragment] = React.useState(false)

    const [currentChatId, setCurrentChatId] = React.useState('')

    const chatFragmentDialogRef = React.useRef<Dialog>(null)
    React.useEffect(() => {
        const shadow = chatFragmentDialogRef.current!.shadowRoot as ShadowRoot
        const panel = shadow.querySelector(".panel") as HTMLElement
        panel.style.padding = '0'
        panel.style.color = 'inherit'
        panel.style.backgroundColor = 'rgb(var(--mdui-color-background))'
        panel.style.setProperty('--mdui-color-background', 'inherit')
        const body = shadow.querySelector(".body") as HTMLElement
        body.style.height = '100%'
        body.style.display = 'flex'
    })

    useAsyncEffect(async () => {
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
            width: 'var(--whitesilk-window-width)',
            height: 'var(--whitesilk-window-height)',
        }}>
            <mdui-dialog fullscreen open={isShowChatFragment} ref={chatFragmentDialogRef}>
                {
                    // 聊天页面
                }
                <div id="ChatFragment" style={{
                    width: '100%',
                    height: '100%',
                }}>
                    <ChatFragment
                        showReturnButton={true}
                        onReturnButtonClicked={() => setIsShowChatFragment(false)}
                        target={currentChatId} />
                </div>
            </mdui-dialog>

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

            <mdui-navigation-bar scroll-target="#SideBar" label-visibility="selected" value="Recents" ref={navigationBarRef}>
                <mdui-navigation-bar-item icon="watch_later--outlined" active-icon="watch_later--filled" value="Recents">最近</mdui-navigation-bar-item>
                <mdui-navigation-bar-item icon="contacts--outlined" active-icon="contacts--filled" value="Contacts">聯絡人</mdui-navigation-bar-item>
            </mdui-navigation-bar>
            {
                // 侧边列表
            }
            <div style={{
                display: 'flex',
                height: 'calc(100% - 80px)',
                width: '100%',
            }} id="SideBar">
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
                    // 联系人列表
                    <ContactsList
                        setChatInfo={setChatInfo}
                        chatInfoDialogRef={chatInfoDialogRef as any}
                        display={navigationItemSelected == "Contacts"} />
                }
            </div>
        </div>
    )
}