import Message from "./chat/Message.js"
import MessageContainer from "./chat/MessageContainer.js"
import ContactsListItem from "./main/ContactsListItem.js"
import RecentsListItem from "./main/RecentsListItem.js"
import useEventListener from './useEventListener.js'

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
            <mdui-navigation-rail contained value="Recents" ref={navigationRailRef}>
                <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>

                <mdui-navigation-rail-item icon="watch_later--outlined" value="Recents"></mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="contacts--outlined" value="Contacts"></mdui-navigation-rail-item>

                <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
            </mdui-navigation-rail>
            {
                // 侧边列表
            }
            <mdui-list style={{
                width: "35%",
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {
                    navigationItemSelected == "Recents" ?
                        // 最近聊天
                        recentsList.map((v) =>
                            <RecentsListItem
                                nickName={v.nickName}
                                avatar={v.avatar}
                                content={v.content} />
                        ) :
                        // 联系人列表
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
            <div style={{
                height: 'calc(var(--whitesilk-window-height) - 16px)',
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
            }}>
                <mdui-top-app-bar style={{
                    position: 'relative',
                }}>
                    <mdui-button-icon icon="menu"></mdui-button-icon>
                    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
                    <mdui-button-icon icon="more_vert"></mdui-button-icon>
                </mdui-top-app-bar>
                <MessageContainer style={{
                    overflowY: 'auto',
                    height: '100%',
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
            </div>

        </div >
    )
}