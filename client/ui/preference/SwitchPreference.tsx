import { $ } from 'mdui/jq'
import { Switch } from 'mdui'
import React from 'react'
import useEventListener from '../useEventListener.ts'

export default function SwitchPreference({ title, icon, updater, disabled, description } = {
    disabled: false,
}) {
    const switchRef = React.useRef<Switch>(null)
    
    return <mdui-list-item disabled={disabled ? true : undefined} rounded icon={icon} onClick={() => {
        switchRef.current!.checked = !switchRef.current!.checked
        updater(switchRef.current!.checked)
    }}>
        {title}
        {description && <span slot="description">{description}</span>}
        <mdui-switch slot="end-icon" checked-icon="" ref={switchRef} onClick={(e) => e.preventDefault()}></mdui-switch>
    </mdui-list-item>
}