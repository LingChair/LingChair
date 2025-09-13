import Client from "../api/Client.ts"
import data from "../Data.ts"
import ChatFragment from "./chat/ChatFragment.jsx"
import ContactsListItem from "./main/ContactsListItem.jsx"
import RecentsListItem from "./main/RecentsListItem.jsx"
import useEventListener from './useEventListener.ts'
import User from "../api/client_data/User.ts"
import RecentChat from "../api/client_data/RecentChat.ts"
import Avatar from "./Avatar.tsx"

import * as React from 'react'
import { Button, ButtonIcon, Dialog, NavigationBar, TextField } from "mdui"
import Split from 'split.js'
import 'mdui/jsx.zh-cn.d.ts'
import { checkApiSuccessOrSncakbar } from "./snackbar.ts"

import RegisterDialog from "./dialog/RegisterDialog.tsx"
import LoginDialog from "./dialog/LoginDialog.tsx"
import UserProfileDialog from "./dialog/UserProfileDialog.tsx"

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
    const [recentsList, setRecentsList] = React.useState([
        {
            id: '0',
            avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
            title: "麻油衣酱",
            content: "成步堂君, 我又坐牢了（"
        },
        {
            id: '0',
            avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
            title: "Maya Fey",
            content: "我是绫里真宵, 是一名灵媒师~"
        },
    ] as RecentChat[])
    const [contactsMap, setContactsMap] = React.useState({
        所有: [
            {
                id: '0',
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickname: "麻油衣酱",
            },
            {
                id: '0',
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickname: "Maya Fey",
            },
        ],
    } as unknown as { [key: string]: User[] })
    const [navigationItemSelected, setNavigationItemSelected] = React.useState('Recents')

    const navigationBarRef: React.MutableRefObject<NavigationRail | null> = React.useRef(null)
    useEventListener(navigationBarRef, 'change', (event) => {
        setNavigationItemSelected((event.target as HTMLElement as NavigationBar).value as string)
    })

    const loginDialogRef: React.MutableRefObject<Dialog | null> = React.useRef(null)
    const loginInputAccountRef: React.MutableRefObject<TextField | null> = React.useRef(null)
    const loginInputPasswordRef: React.MutableRefObject<TextField | null> = React.useRef(null)

    const registerDialogRef: React.MutableRefObject<Dialog | null> = React.useRef(null)
    const registerInputUserNameRef: React.MutableRefObject<TextField | null> = React.useRef(null)
    const registerInputNickNameRef: React.MutableRefObject<TextField | null> = React.useRef(null)
    const registerInputPasswordRef: React.MutableRefObject<TextField | null> = React.useRef(null)

    const userProfileDialogRef: React.MutableRefObject<Dialog | null> = React.useRef(null)
    const openMyUserProfileDialogButtonRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null)
/*    useEventListener(openMyUserProfileDialogButtonRef, 'click', (_event) => {
        userProfileDialogRef.current!.open = true
    })*/

    const [myUserProfileCache, setMyUserProfileCache]: [User, React.Dispatch<React.SetStateAction<User>>] = React.useState(null as unknown as User)

    React.useEffect(() => {
        ; (async () => {
            Client.connect()
            const re = await Client.auth(data.access_token || "")
            if (re.code == 401)
                loginDialogRef.current!.open = true
            else if (re.code != 200) {
                if (checkApiSuccessOrSncakbar(re, "驗證失敗")) return
            } else if (re.code == 200) {
                setMyUserProfileCache(Client.myUserProfile as User)
            }
        })()
    }, [])

    return (
        <div style={{
            display: "flex",
            position: 'relative',
            width: 'var(--whitesilk-window-width)',
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
                userProfileDialogRef={userProfileDialogRef}
                user={myUserProfileCache} />
            
            <mdui-navigation-bar scroll-target="#SideBar" label-visibility="selected" value="Recents" ref={navigationBarRef}>
                <mdui-navigation-bar-item icon="watch_later--outlined" value="Recents">最近</mdui-navigation-bar-item>
                <mdui-navigation-bar-item icon="contacts--outlined" value="Contacts">聯絡人</mdui-navigation-bar-item>
            </mdui-navigation-bar>
            
            <div style={{
                display: 'flex',
                height: 'calc(100% - 80px)',
                width: '100%',
            }} id="SideBar">
                {
                    // 最近聊天
                    <mdui-list style={{
                        overflowY: 'auto',
                        marginLeft: '10px',
                        marginRight: '10px',
                        width: '100%',
                        display: navigationItemSelected == "Recents" ? undefined : 'none'
                    }}>
                        {
                            recentsList.map((v) =>
                                <RecentsListItem
                                    key={v.id}
                                    nickName={v.title}
                                    avatar={v.avatar}
                                    content={v.content} />
                            )
                        }
                    </mdui-list>
                }
                {
                    // 联系人列表
                    <mdui-list style={{
                        overflowY: 'auto',
                        marginLeft: '10px',
                        marginRight: '10px',
                        width: '100%',
                        display: navigationItemSelected == "Contacts" ? undefined : 'none'
                    }}>
                        <mdui-collapse accordion value={Object.keys(contactsMap)[0]}>
                            {
                                Object.keys(contactsMap).map((v) =>
                                    <mdui-collapse-item key={v} value={v}>
                                        <mdui-list-subheader slot="header">{v}</mdui-list-subheader>
                                        {
                                            contactsMap[v].map((v2) =>
                                                <ContactsListItem
                                                    key={v2.id}
                                                    nickName={v2.nickname}
                                                    avatar={v2.avatar} />
                                            )
                                        }
                                    </mdui-collapse-item>
                                )
                            }
                        </mdui-collapse>
                    </mdui-list>
                }
            </div>
        </div>
    )
}