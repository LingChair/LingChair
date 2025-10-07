import { $ } from 'mdui/jq'
import { Switch } from 'mdui'
import React from 'react'
import useEventListener from '../useEventListener.ts'

export default function Preference({ title, icon, disabled, description, ...props } = {
    disabled: false,
}) {
    return <mdui-list-item disabled={disabled ? true : undefined} rounded icon={icon} {...props}>
        {title}
        {description && <span slot="description">{description}</span>}
    </mdui-list-item>
}