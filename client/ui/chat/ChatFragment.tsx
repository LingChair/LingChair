import { Tab, TextField } from "mdui"
import { $ } from "mdui/jq"
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
import * as marked from 'marked'
import DOMPurify from 'dompurify'
import randomUUID from "../../randomUUID.ts"
import EventBus from "../../EventBus.ts"
import User from "../../api/client_data/User.ts"

import PreferenceLayout from '../preference/PreferenceLayout.tsx'
import PreferenceHeader from '../preference/PreferenceHeader.tsx'
import PreferenceStore from '../preference/PreferenceStore.ts'
import SwitchPreference from '../preference/SwitchPreference.tsx'
import SelectPreference from '../preference/SelectPreference.tsx'
import TextFieldPreference from '../preference/TextFieldPreference.tsx'
import Preference from '../preference/Preference.tsx'
import GroupSettings from "../../api/client_data/GroupSettings.ts"
import PreferenceUpdater from "../preference/PreferenceUpdater.ts";

interface Args extends React.HTMLAttributes<HTMLElement> {
    target: string
    showReturnButton?: boolean
    openChatInfoDialog: (chat: Chat) => void
    onReturnButtonClicked?: () => void
    openUserInfoDialog: (user: User | string) => void
}

const markedInstance = new marked.Marked({
    renderer: {
        heading({ tokens, depth: _depth }) {
            const text = this.parser.parseInline(tokens)
            return `<span>${text}</span>`
        },
        paragraph({ tokens }) {
            const text = this.parser.parseInline(tokens)
            return `<span>${text}</span>`
        },
        image({ text, href }) {
            const type = /^(Video|File)=.*/.exec(text)?.[1] || 'Image'
            if (/uploaded_files\/[A-Za-z0-9]+$/.test(href)) {
                return ({
                    Image: `<chat-image src="${href}" alt="${text}"></chat-image>`,
                    Video: `<chat-video src="${href}"></chat-video>`,
                    File: `<chat-file href="${href}" name="${/^Video|File=(.*)/.exec(text)?.[1] || 'Unnamed file'}"></chat-file>`,
                })?.[type] || ``
            }
            return ``
        },
    }
})

export default function ChatFragment({ target, showReturnButton, onReturnButtonClicked, openChatInfoDialog, openUserInfoDialog, ...props }: Args) {
    const [messagesList, setMessagesList] = React.useState([] as Message[])
    const [chatInfo, setChatInfo] = React.useState({
        title: '加载中...'
    } as Chat)

    const [tabItemSelected, setTabItemSelected] = React.useState('None')
    const tabRef = React.useRef<Tab>(null)
    const chatPanelRef = React.useRef<HTMLElement>(null)
    useEventListener(tabRef, 'change', () => {
        tabRef.current != null && setTabItemSelected(tabRef.current!.value as string)
    })

    useAsyncEffect(async () => {
        const re = await Client.invoke('Chat.getInfo', {
            token: data.access_token,
            target: target,
        })
        if (re.code != 200)
            return target != '' && checkApiSuccessOrSncakbar(re, "获取对话信息失败")
        setChatInfo(re.data as Chat)

        await loadMore()

        setTabItemSelected("Chat")
        if (re.data!.type == 'group') {
            groupPreferenceStore.setState(re.data!.settings as GroupSettings)
        }
        setTimeout(() => {
            chatPanelRef.current!.scrollTo({
                top: 10000000000,
                behavior: "smooth",
            })
        }, 300)
    }, [target])

    const page = React.useRef(0)
    async function loadMore() {
        const re = await Client.invoke("Chat.getMessageHistory", {
            token: data.access_token,
            target,
            page: page.current,
        })

        if (checkApiSuccessOrSncakbar(re, "拉取对话记录失败")) return
        const returnMsgs = (re.data!.messages as Message[]).reverse()
        page.current++
        if (returnMsgs.length == 0) {
            setShowNoMoreMessagesTip(true)
            setTimeout(() => setShowNoMoreMessagesTip(false), 1000)
            return
        }

        const oldest = messagesList[0]
        setMessagesList(returnMsgs.concat(messagesList))
        setTimeout(() => chatPanelRef.current!.scrollTo({ top: $(`#chat_${target}_message_${oldest.id}`).get(0).offsetTop, behavior: 'smooth' }), 100)
    }

    React.useEffect(() => {
        interface OnMessageData {
            chat: string
            msg: Message
        }
        function callback(data: unknown) {
            EventBus.emit('RecentsList.updateRecents')

            const { chat, msg } = (data as OnMessageData)
            if (target == chat) {
                setMessagesList(messagesList.concat([msg]))
                if ((chatPanelRef.current!.scrollHeight - chatPanelRef.current!.scrollTop - chatPanelRef.current!.clientHeight) < 130)
                    setTimeout(() => chatPanelRef.current!.scrollTo({
                        top: 10000000000,
                        behavior: "smooth",
                    }), 100)
            }
        }

        Client.on('Client.onMessage', callback)
        return () => {
            Client.off('Client.onMessage', callback)
        }
    })

    const inputRef = React.useRef<TextField>(null)
    const [showLoadingMoreMessagesTip, setShowLoadingMoreMessagesTip] = React.useState(false)
    const [showNoMoreMessagesTip, setShowNoMoreMessagesTip] = React.useState(false)

    const [isMessageSending, setIsMessageSending] = React.useState(false)

    const cachedFiles = React.useRef({} as { [fileName: string]: ArrayBuffer })
    const cachedFileNamesCount = React.useRef({} as { [fileName: string]: number })
    async function sendMessage() {
        try {
            let text = inputRef.current!.value
            if (text.trim() == '') return
            setIsMessageSending(true)
            for (const fileName of Object.keys(cachedFiles.current)) {
                if (text.indexOf(fileName) != -1) {
                    const re = await Client.invoke("Chat.uploadFile", {
                        token: data.access_token,
                        file_name: fileName,
                        target,
                        data: cachedFiles.current[fileName],
                    }, 5000)
                    if (checkApiSuccessOrSncakbar(re, `文件[${fileName}] 上传失败`)) return setIsMessageSending(false)
                    text = text.replaceAll('(' + fileName + ')', '(' + re.data!.file_path as string + ')')
                }
            }

            const re = await Client.invoke("Chat.sendMessage", {
                token: data.access_token,
                target,
                text,
            }, 5000)
            if (checkApiSuccessOrSncakbar(re, "发送失败")) return setIsMessageSending(false)
            inputRef.current!.value = ''
            cachedFiles.current = {}
        } catch (e) {
            snackbar({
                message: '发送失败: ' + (e as Error).message,
                placement: 'top',
            })
        }
        setIsMessageSending(false)
    }

    const attachFileInputRef = React.useRef<HTMLInputElement>(null)

    function insertText(text: string) {
        const input = inputRef.current!.shadowRoot!.querySelector('[part=input]') as HTMLTextAreaElement
        inputRef.current!.value = input.value!.substring(0, input.selectionStart as number) + text + input.value!.substring(input.selectionEnd as number, input.value.length)
    }
    async function addFile(type: string, name_: string, data: Blob | Response) {
        let name = name_
        while (cachedFiles.current[name] != null) {
            name = name_ + '_' + cachedFileNamesCount.current[name]
            cachedFileNamesCount.current[name]++
        }

        cachedFiles.current[name] = await data.arrayBuffer()
        cachedFileNamesCount.current[name] = 1
        if (type.startsWith('image/'))
            insertText(`![图片](${name})`)
        else if (type.startsWith('video/'))
            insertText(`![Video=${name}](${name})`)
        else
            insertText(`![File=${name}](${name})`)
    }
    useEventListener(attachFileInputRef, 'change', (_e) => {
        const files = attachFileInputRef.current!.files as unknown as File[]
        if (files?.length == 0) return

        for (const file of files) {
            addFile(file.type, file.name, file)
        }
    })

    const groupPreferenceStore = new PreferenceStore<GroupSettings>()
    groupPreferenceStore.setOnUpdate(async (value) => {
        const re = await Client.invoke("Chat.updateSettings", {
            token: data.access_token,
            target,
            settings: value,
        })
        if (checkApiSuccessOrSncakbar(re, "更新设定失败")) return
    })

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        }} {...props}>
            <mdui-tabs ref={tabRef} value={tabItemSelected} style={{
                position: 'sticky',
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}>
                {
                    showReturnButton && <mdui-button-icon icon="arrow_back" onClick={onReturnButtonClicked} style={{
                        alignSelf: 'center',
                        marginLeft: '5px',
                        marginRight: '5px',
                    }}></mdui-button-icon>
                }
                <mdui-tab value="Chat">{
                    chatInfo.title
                }</mdui-tab>
                <mdui-tab value="Settings">设置</mdui-tab>
                <mdui-tab value="None" style={{ display: 'none' }}></mdui-tab>
                <div style={{
                    flexGrow: '1',
                }}></div>
                <mdui-button-icon icon="info" onClick={() => openChatInfoDialog(chatInfo)} style={{
                    alignSelf: 'center',
                    marginLeft: '5px',
                    marginRight: '5px',
                }}></mdui-button-icon>

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
                            }}>加载中...</span>
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
                            (() => {
                                let date = new Date(0)
                                return messagesList.map((msg) => {
                                    const rendeText = DOMPurify.sanitize(markedInstance.parse(msg.text) as string, {
                                        ALLOWED_TAGS: [
                                            "chat-image",
                                            "chat-video",
                                            "chat-file",
                                            "span",
                                            "chat-link",
                                        ],
                                        ALLOWED_ATTR: [
                                            'src',
                                            'alt',
                                            'href',
                                            'name',
                                        ],
                                    }).replaceAll('\n', '<br>')
                                    const lastDate = date
                                    date = new Date(msg.time)

                                    const msgElement = <Element_Message
                                        rawData={msg.text}
                                        renderHTML={rendeText}
                                        message={msg}
                                        key={msg.id}
                                        slot="trigger"
                                        id={`chat_${target}_message_${msg.id}`}
                                        userId={msg.user_id}
                                        openUserInfoDialog={openUserInfoDialog} />

                                    return (
                                        <>
                                            {
                                                (date.getMinutes() != lastDate.getMinutes() || date.getDate() != lastDate.getDate() || date.getMonth() != lastDate.getMonth() || date.getFullYear() != lastDate.getFullYear())
                                                && <mdui-tooltip content={`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}>
                                                    <div style={{
                                                        fontSize: '87%',
                                                        marginTop: '10px',
                                                    }}>
                                                        {
                                                            (date.getFullYear() != lastDate.getFullYear() ? `${date.getFullYear()}年` : '')
                                                            + `${date.getMonth() + 1}月`
                                                            + `${date.getDate()}日`
                                                            + `  ${date.getHours()}:${date.getMinutes()}`
                                                        }
                                                    </div>
                                                </mdui-tooltip>
                                            }
                                            {
                                                msgElement
                                            }
                                        </>
                                    )
                                })
                            })()
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
                        position: 'sticky',
                        bottom: '0',
                        paddingLeft: '5px',
                        paddingRight: '4px',
                        backgroundColor: 'rgb(var(--mdui-color-surface))',
                    }} onDrop={(e) => {
                        function getFileNameOrRandom(urlString: string) {
                            const url = new URL(urlString)
                            let filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1).trim()
                            if (filename == '')
                                filename = 'file_' + randomUUID()
                            return filename
                        }
                        if (e.dataTransfer.items.length > 0) {
                            // 基于当前的实现, 浏览器不会读取文件的字节流来确定其媒体类型, 其根据文件扩展名进行假设
                            // https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/type
                            for (const item of e.dataTransfer.items) {
                                if (item.type == 'text/uri-list') {
                                    item.getAsString(async (url) => {
                                        try {
                                            // 即便是 no-cors 還是殘廢, 因此暫時沒有什麽想法
                                            const re = await fetch(url)
                                            const type = re.headers.get("Content-Type")
                                            if (type && re.ok)
                                                addFile(type as string, getFileNameOrRandom(url), re)
                                        } catch (e) {
                                            snackbar({
                                                message: '无法解析链接: ' + (e as Error).message,
                                                placement: 'top',
                                            })
                                        }
                                    })
                                } else if (item.kind == 'file') {
                                    e.preventDefault()
                                    const file = item.getAsFile() as File
                                    addFile(item.type, file.name, file)
                                }
                            }
                        }
                    }}>
                        <mdui-text-field variant="outlined" placeholder="(｡･ω･｡)" autosize ref={inputRef as any} max-rows={6} onChange={() => {
                            if (inputRef.current?.value.trim() == '')
                                cachedFiles.current = {}
                        }} onKeyDown={(event) => {
                            if (event.ctrlKey && event.key == 'Enter')
                                sendMessage()
                        }} onPaste={(event) => {
                            for (const item of event.clipboardData.items) {
                                if (item.kind == 'file') {
                                    event.preventDefault()
                                    const file = item.getAsFile() as File
                                    addFile(item.type, file.name, file)
                                }
                            }
                        }} style={{
                            marginRight: '10px',
                            marginTop: '3px',
                            marginBottom: '3px',
                        }}></mdui-text-field>
                        <mdui-button-icon slot="end-icon" icon="attach_file" style={{
                            marginRight: '6px',
                        }} onClick={() => {
                            attachFileInputRef.current!.click()
                        }}></mdui-button-icon>
                        <mdui-button-icon icon="send" style={{
                            marginRight: '7px',
                        }} onClick={() => sendMessage()} loading={isMessageSending}></mdui-button-icon>
                        <div style={{
                            display: 'none'
                        }}>
                            <input accept="*/*" type="file" name="添加文件" multiple ref={attachFileInputRef}></input>
                        </div>
                    </div>
                </mdui-tab-panel>
                <mdui-tab-panel slot="panel" value="Settings" style={{
                    display: tabItemSelected == "Settings" ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                }}>
                    {
                        chatInfo.type == 'group' && <PreferenceLayout>
                            <PreferenceUpdater.Provider value={groupPreferenceStore.createUpdater()}>
                                <PreferenceHeader
                                    title="群组管理" />
                                <Preference
                                    title="群组成员列表"
                                    icon="group"
                                    disabled={true}
                                    description="别看了, 还没做" />
                                <PreferenceHeader
                                    title="入群设定" />
                                <SwitchPreference
                                    title="允许入群"
                                    icon="person_add"
                                    id="allow_new_member_join"
                                    state={groupPreferenceStore.state.allow_new_member_join || false} />
                                <SwitchPreference
                                    title="允许成员邀请"
                                    description="目前压根没有这项功能, 甚至还不能查看成员列表, 以后再说吧"
                                    id="allow_new_member_from_invitation"
                                    icon="_"
                                    disabled={true}
                                    state={groupPreferenceStore.state.allow_new_member_from_invitation || false} />
                                <SelectPreference
                                    title="入群验证方式"
                                    icon="_"
                                    id="new_member_join_method"
                                    selections={{
                                        disabled: "无需验证",
                                        allowed_by_admin: "只需要管理员批准 (WIP)",
                                        answered_and_allowed_by_admin: "需要回答问题并获得管理员批准 (WIP)",
                                    }}
                                    disabled={!groupPreferenceStore.state.allow_new_member_join}
                                    state={groupPreferenceStore.state.new_member_join_method || 'disabled'} />
                                {
                                    groupPreferenceStore.state.new_member_join_method == 'answered_and_allowed_by_admin'
                                    && <TextFieldPreference
                                        title="设置问题"
                                        icon="_"
                                        id="answered_and_allowed_by_admin_question"
                                        description="WIP"
                                        state={groupPreferenceStore.state.answered_and_allowed_by_admin_question || ''}
                                        disabled={true} />
                                }
                            </PreferenceUpdater.Provider>
                        </PreferenceLayout>
                    }
                    {
                        chatInfo.type == 'private' && (
                            <div>
                                未制作
                            </div>
                        )
                    }
                </mdui-tab-panel>
                <mdui-tab-panel slot="panel" value="None">
                </mdui-tab-panel>
            </mdui-tabs>
        </div>
    )
}
