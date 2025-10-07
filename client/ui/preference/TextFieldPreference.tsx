import React from 'react'
import { prompt } from 'mdui'

interface Args extends React.HTMLAttributes<HTMLElement> {
    title: string
    description?: string
    icon: string
    updater: (value: unknown) => void
    defaultState: string
    disabled?: boolean
}

export default function TextFieldPreference({ title, icon, description, updater, defaultState, disabled }: Args) {
    const [ text, setText ] = React.useState(defaultState)
    
    return <mdui-list-item icon={icon} rounded disabled={disabled ? true : undefined} onClick={() => {
        prompt({
            headline: title,
            confirmText: "确定",
            cancelText: "取消",
            onConfirm: (value) => {
                setText(value)
                updater(value)
            },
            onCancel: () => {},
            textFieldOptions: {
                label: description,
                value: text,
            },
        })
    }}>
        {title}
        {description && <span slot="description">{description}</span>}
    </mdui-list-item>
}