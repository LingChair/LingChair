import Message from "./chat/Message.js"
import MessageContainer from "./chat/MessageContainer.js"
import ContactsListItem from "./main/ContactsListItem.js"
import RecentsListItem from "./main/RecentsListItem.js"
import useEventListener from './useEventListener.js'
import ShadowInner from './ShadowInner.js'

export default function App() {
    const [recentsList, setRecentsList] = React.useState([
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
    ])
    const [contactsMap, setContactsMap] = React.useState({
        默认分组: [
            {
                userId: 0,
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickName: "麻油衣酱",
            },
            {
                userId: 0,
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickName: "Maya Fey",
            }
        ],
        测试分组114514: [
            {
                userId: 0,
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickName: "麻油衣酱",
            },
            {
                userId: 0,
                avatar: "https://www.court-records.net/mugshot/aa6-004-maya.png",
                nickName: "Maya Fey",
            }
        ],
    })
    const [navigationItemSelected, setNavigationItemSelected] = React.useState('Recents')

    const navigationRailRef = React.useRef(null)
    useEventListener(navigationRailRef, 'change', (event) => {
        setNavigationItemSelected(event.target.value)
    })

    return (
        <div style={{
            display: "flex",
            position: 'relative',
            width: 'calc(var(--whitesilk-window-width) - 80px)',
            height: 'var(--whitesilk-window-height)',
        }}>
            {
                // 移动端用 页面调试
                (new URL(location.href).searchParams.get('debug') == 'true') && <script src="https://unpkg.com/eruda/eruda.js"></script>
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
                (navigationItemSelected == "Recents") &&
                <mdui-list style={{
                    width: "35%",
                    overflowY: 'auto',
                    paddingRight: '10px'
                }}>
                    {
                        recentsList.map((v) =>
                            <RecentsListItem
                                nickName={v.nickName}
                                avatar={v.avatar}
                                content={v.content} />
                        )
                    }
                </mdui-list>
            }
            {
                // 联系人列表
                (navigationItemSelected == "Contacts") &&
                <mdui-list style={{
                    width: "35%",
                    overflowY: 'auto',
                    paddingRight: '10px'
                }}>
                    {
                        Object.keys(contactsMap).map((v) =>
                            <>
                                <mdui-list-subheader>{v}</mdui-list-subheader>
                                {
                                    contactsMap[v].map((v2) =>
                                        <ContactsListItem
                                            nickName={v2.nickName}
                                            avatar={v2.avatar} />
                                    )
                                }
                            </>
                        )
                    }
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
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
            }}>
                <mdui-top-app-bar style={{
                    position: 'sticky',
                }}>
                    <mdui-button-icon icon="menu"></mdui-button-icon>
                    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
                    <mdui-button-icon icon="more_vert"></mdui-button-icon>
                </mdui-top-app-bar>
                <div>
                    <MessageContainer style={{
                        height: '100%',
                        paddingBottom: '20px',
                    }}>
                        <Message
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            direction="right"
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            direction="right"
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            direction="right"
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                        <Message
                            direction="right"
                            nickName="Fey"
                            avatar="https://www.court-records.net/mugshot/aa6-004-maya.png">
                            Test
                        </Message>
                    </MessageContainer>
                    {
                        // 输入框
                    }
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: '0.1rem',
                        paddingTop: '0.1rem',
                        height: '4rem',
                        position: 'sticky',
                        bottom: '0',
                        backgroundColor: 'rgb(var(--mdui-color-background))',
                    }}>
                        <mdui-text-field variant="outlined" placeholder="喵呜~">
                            <mdui-button-icon slot="end-icon" icon="more_vert"></mdui-button-icon>
                        </mdui-text-field>
                        <mdui-button-icon icon="send" style={{
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                            marginLeft: '0.75rem',
                            marginRight: '0.4rem',
                        }}></mdui-button-icon>
                    </div>
                    {/* <mdui-top-app-bar style={{
                        position: 'sticky',
                        bottom: '0',
                    }}>
                        <mdui-button-icon icon="menu"></mdui-button-icon>
                        <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
                        <div style={{
                            flexGrow: 1,
                        }}></div>
                        <mdui-button-icon icon="more_vert"></mdui-button-icon>
                    </mdui-top-app-bar> */}
                </div>
            </div>
        </div>
    )
}