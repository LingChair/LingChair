import Client from "../api/Client.ts"
import data from "../Data.ts"
import ChatFragment from "./chat/ChatFragment.jsx"
import LoginDialog from "./dialog/LoginDialog.tsx"
import ContactsListItem from "./main/ContactsListItem.jsx"
import RecentsListItem from "./main/RecentsListItem.jsx"
import useEventListener from './useEventListener.js'
import User from "../api/client_data/User.ts"
import RecentChat from "../api/client_data/RecentChat.ts"

import * as React from 'react'
import * as CryptoES from 'crypto-es'
import { Button, Dialog, NavigationRail, snackbar, TextField } from "mdui"
import Split from 'split.js'
import 'mdui/jsx.zh-cn.d.ts'

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicAttributes {
                id?: string
            }
        }
    }
}

export default function App() {
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

    const navigationRailRef = React.useRef(null)
    useEventListener(navigationRailRef, 'change', (event) => {
        setNavigationItemSelected((event.target as HTMLElement as NavigationRail).value as string)
    })

    const loginDialogRef: React.MutableRefObject<Dialog | null> = React.useRef(null)
    const inputAccountRef: React.MutableRefObject<TextField | null> = React.useRef(null)
    const inputPasswordRef: React.MutableRefObject<TextField | null> = React.useRef(null)
    const registerButtonRef: React.MutableRefObject<Button | null> = React.useRef(null)
    const loginButtonRef: React.MutableRefObject<Button | null> = React.useRef(null)

    useEventListener(loginButtonRef, 'click', async () => {
        const account = inputAccountRef.current!.value
        const password = inputPasswordRef.current!.value

        const re = await Client.invoke("User.login", {
            account: account,
            password: CryptoES.SHA256(password),
        })
        if (re.code != 200)
            snackbar({
                message: "登錄失敗: " + re.msg
            })
    })

    React.useEffect(() => {
        ;(async () => {
            Split(['#SideBar', '#ChatFragment'], {
                sizes: [25, 75],
                minSize: [200, 400],
                gutterSize: 2,
            })

            Client.connect()
            const re = await Client.invoke("User.auth", {
                access_token: data.access_token,
            })
            if (re.code == 401)
                loginDialogRef.current!.open = true
            else if (re.code != 200)
                snackbar({
                    message: "驗證失敗: " + re.msg
                })
        })()
    }, [])

    return (
        <div style={{
            display: "flex",
            position: 'relative',
            width: 'calc(var(--whitesilk-window-width) - 80px)',
            height: 'var(--whitesilk-window-height)',
        }}>
            <LoginDialog
                loginDialogRef={loginDialogRef}
                inputAccountRef={inputAccountRef}
                inputPasswordRef={inputPasswordRef}
                registerButtonRef={registerButtonRef}
                loginButtonRef={loginButtonRef} />
            <mdui-navigation-rail contained value="Recents" ref={navigationRailRef}>
                <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>

                <mdui-navigation-rail-item icon="watch_later--outlined" value="Recents"></mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="contacts--outlined" value="Contacts"></mdui-navigation-rail-item>

                <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
            </mdui-navigation-rail>
            {
                // 侧边列表
            }
            <div id="SideBar">
                {
                    // 最近聊天
                    <mdui-list style={{
                        overflowY: 'auto',
                        paddingRight: '10px',
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
                        paddingRight: '10px',
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
            {
                // 聊天页面
            }
            <ChatFragment id="ChatFragment" />
        </div>
    )
}