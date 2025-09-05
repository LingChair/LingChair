import Client from "../api/Client.ts";
import data from "../Data.ts";
import ChatFragment from "./chat/ChatFragment.jsx"
import LoginDialog from "./dialog/LoginDialog.jsx"
import ContactsListItem from "./main/ContactsListItem.jsx"
import RecentsListItem from "./main/RecentsListItem.jsx"
import snackbar from "./snackbar.js";
import useEventListener from './useEventListener.js'

export default function App() {
    const [recentsList, setRecentsList] = React.useState([
        /* {
            userId: 0,
            avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
            nickName: "麻油衣酱",
            content: "成步堂君, 我又坐牢了（"
        },
        {
            userId: 0,
            avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
            nickName: "Maya Fey",
            content: "我是绫里真宵, 是一名灵媒师~"
        }, */
    ])
    const [contactsMap, setContactsMap] = React.useState({
        所有: [
            /* {
                userId: 0,
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickName: "麻油衣酱",
            },
            {
                userId: 0,
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickName: "Maya Fey",
            }, */
        ],
    })
    const [navigationItemSelected, setNavigationItemSelected] = React.useState('Recents')

    const navigationRailRef = React.useRef(null)
    useEventListener(navigationRailRef, 'change', (event) => {
        setNavigationItemSelected(event.target.value)
    })

    const [
        loginDialogRef,
        inputAccountRef,
        inputPasswordRef,
        registerButtonRef,
        loginButtonRef
    ] = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)]

    React.useEffect(async () => {
        Client.connect()
        const re = await Client.invoke("User.auth", {
            access_token: data.access_token,
        })
        if (re.code == 401)
            loginDialogRef.current.show()
        else if (re.code != 200)
            snackbar("驗證失敗: " + re.msg)
    })

    return (
        <div style={{
            display: "flex",
            position: 'relative',
            width: 'calc(var(--whitesilk-window-width) - 80px)',
            height: 'var(--whitesilk-window-height)',
        }}>
            <LoginDialog
                ref={loginDialogRef}
                inputAccountRef={inputAccountRef}
                inputPasswordRef={inputPasswordRef}
                registerButtonRef={registerButtonRef}
                loginButtonRef={loginButtonRef} />
            {
                // 移动端用 页面调试
                // 換個地方弄
                // (new URL(location.href).searchParams.get('debug') == 'true') && <script src="https://unpkg.com/eruda/eruda.js"></script>
            }
            <mdui-navigation-rail contained value="Recents" ref={navigationRailRef}>
                <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>

                <mdui-navigation-rail-item icon="watch_later--outlined" value="Recents"></mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="contacts--outlined" value="Contacts"></mdui-navigation-rail-item>

                <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
            </mdui-navigation-rail>
            {
                // 侧边列表
            }
            {
                // 最近聊天
                <mdui-list style={{
                    width: "35%",
                    overflowY: 'auto',
                    paddingRight: '10px',
                    display: navigationItemSelected == "Recents" ? null : 'none'
                }}>
                    {
                        recentsList.map((v) =>
                            <RecentsListItem
                                key={v.userId}
                                nickName={v.nickName}
                                avatar={v.avatar}
                                content={v.content} />
                        )
                    }
                </mdui-list>
            }
            {
                // 联系人列表
                <mdui-list style={{
                    width: "35%",
                    overflowY: 'auto',
                    paddingRight: '10px',
                    display: navigationItemSelected == "Contacts" ? null : 'none'
                }}>
                    <mdui-collapse accordion value={Object.keys(contactsMap)[0]}>
                        {
                            Object.keys(contactsMap).map((v) =>
                                <mdui-collapse-item key={v} value={v}>
                                    <mdui-list-subheader slot="header">{v}</mdui-list-subheader>
                                    {
                                        contactsMap[v].map((v2) =>
                                            <ContactsListItem
                                                key={v2.userId}
                                                nickName={v2.nickName}
                                                avatar={v2.avatar} />
                                        )
                                    }
                                </mdui-collapse-item>
                            )
                        }
                    </mdui-collapse>
                </mdui-list>
            }
            {
                // 分割线
            }
            <div style={{
                // 我们删除了 body 的padding 因此不需要再 calc 了
                height: 'var(--whitesilk-window-height)',
                marginRight: '10px',
            }}>
                <mdui-divider vertical></mdui-divider>
            </div>
            {
                // 聊天页面
            }
            <ChatFragment />
        </div>
    )
}