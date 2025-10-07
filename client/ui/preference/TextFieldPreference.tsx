import { $ } from 'mdui/jq'
import React from 'react'
import { TextField, prompt } from 'mdui'
import useEventListener from '../useEventListener.ts'

export default function TextFieldPreference({ title, icon, description, updater, defaultValue, disabled } = {
    disabled: false,
}) {
    const [ text, setText ] = React.useState(defaultValue)
    
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