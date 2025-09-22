import { Tab, TextField } from "mdui"
import useEventListener from "../useEventListener.ts"
import Element_Message from "./Message.tsx"
import MessageContainer from "./MessageContainer.tsx"

import * as React from 'react'
import Client from "../../api/Client.ts"
import Message from "../../api/client_data/Message.ts"
import Chat from "../../api/client_data/Chat.ts"
import data from "../../Data.ts"
import { checkApiSuccessOrSncakbar, snackbar } from "../snackbar.ts"
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
    const chatPanelRef = React.useRef<HTMLElement>(null)
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

        loadMore()
    }, [target])

    const page = React.useRef(0)
    async function loadMore() {
        const re = await Client.invoke("Chat.getMessageHistory", {
            token: data.access_token,
            target,
            page: page.current,
        })

        if (checkApiSuccessOrSncakbar(re, "拉取歷史記錄失敗")) return
        const returnMsgs = (re.data!.messages as Message[]).reverse()
        if (returnMsgs.length == 0) {
            setShowNoMoreMessagesTip(true)
            setTimeout(() => setShowNoMoreMessagesTip(false), 1000)
            return
        }
        setMessagesList(returnMsgs.concat(messagesList))

        if (page.current == 0)
            setTimeout(() => chatPanelRef.current!.scrollTo({
                top: 10000000000,
                behavior: "smooth",
            }), 100)

        page.current++
    }

    React.useEffect(() => {
        interface OnMessageData {
            chat: string
            msg: Message
        }
        Client.on('Client.onMessage', (data: unknown) => {
            const { chat, msg } = (data as OnMessageData)
            if (target == chat) {
                setMessagesList(messagesList.concat([msg]))
            }
        })
        return () => {
            Client.off('Client.onMessage')
        }
    })

    const inputRef = React.useRef<TextField>(null)
    const [showLoadingMoreMessagesTip, setShowLoadingMoreMessagesTip] = React.useState(false)
    const [showNoMoreMessagesTip, setShowNoMoreMessagesTip] = React.useState(false)

    async function sendMessage() {
        const text = inputRef.current!.value

        const re = await Client.invoke("Chat.sendMessage", {
            token: data.access_token,
            target,
            text,
        }, 5000)
        if (checkApiSuccessOrSncakbar(re, "發送失敗")) return
        inputRef.current!.value = ''

        chatPanelRef.current!.scrollTo({
            top: 10000000000,
            behavior: "smooth",
        })
    }

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

                <mdui-tab-panel slot="panel" value="Chat" ref={chatPanelRef} style={{
                    display: tabItemSelected == "Chat" ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                }} onScroll={async (e) => {
                    const scrollTop = (e.target as HTMLDivElement).scrollTop
                    if (scrollTop == 0 && !showLoadingMoreMessagesTip) {
                        setShowLoadingMoreMessagesTip(true)
                        await loadMore()
                        setShowLoadingMoreMessagesTip(false)
                    }
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: "center",
                        paddingTop: "15px",
                    }}>
                        <div style={{
                            display: showLoadingMoreMessagesTip ? 'flex' : 'none',
                        }}>
                            <mdui-circular-progress style={{
                                width: '30px',
                                height: '30px',
                            }}></mdui-circular-progress>
                            <span style={{
                                alignSelf: 'center',
                                paddingLeft: '12px',
                            }}>加載中...</span>
                        </div>
                        <div style={{
                            display: showNoMoreMessagesTip ? undefined : 'none',
                            alignSelf: 'center',
                        }}>
                            沒有更多消息啦~
                        </div>
                    </div>
                    <MessageContainer style={{
                        paddingTop: "15px",
                        flexGrow: '1',
                    }}>
                        {
                            messagesList.map((msg) =>
                                <Element_Message
                                    key={msg.id}
                                    userId={msg.user_id}>
                                    {msg.text}
                                </Element_Message>
                            )
                        }
                    </MessageContainer>
                    {
                        // 输入框
                    }
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: '2px',
                        paddingTop: '0.1rem',
                        height: '4rem',
                        position: 'sticky',
                        bottom: '0',
                        marginLeft: '5px',
                        marginRight: '4px',
                        backgroundColor: 'rgb(var(--mdui-color-background))',
                    }}>
                        <mdui-text-field variant="outlined" placeholder="喵呜~" autosize ref={inputRef as any} max-rows={1} onKeyDown={(event) => {
                            if (event.ctrlKey && event.key == 'Enter')
                                sendMessage()
                        }} style={{
                            marginRight: '10px',
                        }}></mdui-text-field>
                        <mdui-button-icon slot="end-icon" icon="more_vert" style={{
                            marginRight: '6px',
                        }}></mdui-button-icon>
                        <mdui-button-icon icon="send" style={{
                            marginRight: '7px',
                        }} onClick={() => sendMessage()}></mdui-button-icon>
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
