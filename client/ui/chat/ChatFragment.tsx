import { Tab } from "mdui"
import useEventListener from "../useEventListener.ts"
import Element_Message from "./Message.jsx"
import MessageContainer from "./MessageContainer.jsx"

import * as React from 'react'
import Client from "../../api/Client.ts"
import Message from "../../api/client_data/Message.ts"
import Chat from "../../api/client_data/Chat.ts"
import data from "../../Data.ts"
import { checkApiSuccessOrSncakbar } from "../snackbar.ts"
import useAsyncEffect from "../useAsyncEffect.ts"

interface Args extends React.HTMLAttributes<HTMLElement> {
    target: string,
}

export default function ChatFragment({ target, ...props }: Args) {
    const [messagesList, setMessagesList] = React.useState([] as Message[])
    const [chatInfo, setChatInfo] = React.useState({
        title: '加載中...'
    } as Chat)

    const [tabItemSelected, setTabItemSelected] = React.useState('Chat')
    const tabRef = React.useRef<Tab>(null)
    useEventListener(tabRef, 'change', () => {
        setTabItemSelected(tabRef.current?.value || "Chat")
    })

    useAsyncEffect(async () => {
        const re = await Client.invoke('Chat.getInfo', {
            token: data.access_token,
            target: target,
        })
        if (re.code != 200)
            return checkApiSuccessOrSncakbar(re, "對話錯誤")
        setChatInfo(re.data as Chat)
    }, [target])

    let page = 0
    async function loadMore() {
        const re = await Client.invoke("Chat.getMessageHistory", {
            token: data.access_token,
            target,
            page,
        })

        if (checkApiSuccessOrSncakbar(re, "拉取歷史記錄失敗")) return
        page++
        setMessagesList(messagesList.concat())
    }

    React.useEffect(() => {

        return () => {
            
        }
    })

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        }} {...props}>
            <mdui-tabs ref={tabRef} value="Chat" style={{
                position: 'sticky',
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}>
                <mdui-tab value="Chat">{
                    chatInfo.title
                }</mdui-tab>
                <mdui-tab value="Settings">設定</mdui-tab>

                <mdui-tab-panel slot="panel" value="Chat" style={{
                    display: tabItemSelected == "Chat" ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "15px"
                    }}>
                        <mdui-button variant="text">加載更多</mdui-button>
                    </div>
                    <MessageContainer>
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
                        bottom: '2px',
                        marginLeft: '5px',
                        marginRight: '4px',
                        backgroundColor: 'rgb(var(--mdui-color-background))',
                    }}>
                        <mdui-text-field variant="outlined" placeholder="喵呜~" autosize max-rows={1} style={{
                            marginRight: '10px',
                        }}></mdui-text-field>
                        <mdui-button-icon slot="end-icon" icon="more_vert" style={{
                            marginRight: '6px',
                        }}></mdui-button-icon>
                        <mdui-button-icon icon="send" style={{
                            marginRight: '7px',
                        }}></mdui-button-icon>
                    </div>
                </mdui-tab-panel>
                <mdui-tab-panel slot="panel" value="Settings" style={{
                    display: tabItemSelected == "Settings" ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                }}>
                    Work in progress...
                </mdui-tab-panel>
            </mdui-tabs>
        </div>
    )
}
