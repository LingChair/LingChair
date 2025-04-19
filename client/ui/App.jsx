import Message from "./chat/Message.js"
import MessageContainer from "./chat/MessageContainer.js"
import RecentsListItem from "./main/RecentsListItem.js"

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
        }
    ])
    const [contactsList, setContactsList] = React.useState([])

    return (
        <div style={{
            display: "flex",
        }}>
            <mdui-navigation-rail contained value="Recents">
                <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>

                <mdui-navigation-rail-item icon="watch_later--outlined" value="Recents"></mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="contacts--outlined" value="Contacts"></mdui-navigation-rail-item>

                <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
            </mdui-navigation-rail>
            {
                // 侧边列表
                // 囊括内容: 最近, 联系人
                // 最近 对应 聊天页面
                // 联系人 对应 ???
            }
            <mdui-list style={{
                width: "22.4%"
            }}>
                {
                    recentsList.map((v) =>
                        <RecentsListItem
                            title={v.nickName}
                            avatar={v.avatar}
                            content={v.content} />
                    )
                }
            </mdui-list>
            <div style={{
                height: '100%',
            }}>
                <mdui-divider vertical></mdui-divider>
            </div>
            {
                // 聊天页面
            }
            <div style={{
                width: '100%',
            }}>
                <mdui-top-app-bar style={{
                    position: 'relative',
                }}>
                    <mdui-button-icon icon="menu"></mdui-button-icon>
                    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
                    <mdui-button-icon icon="more_vert"></mdui-button-icon>
                </mdui-top-app-bar>
                <MessageContainer>
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