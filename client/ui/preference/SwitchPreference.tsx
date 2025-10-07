import { Switch } from 'mdui'
import React from 'react'

interface Args extends React.HTMLAttributes<HTMLElement> {
    title: string
    description?: string
    icon: string
    updater: (value: unknown) => void
    defaultState: boolean
    disabled?: boolean
}

export default function SwitchPreference({ title, icon, updater, disabled, description, defaultState }: Args) {
    const switchRef = React.useRef<Switch>(null)
    
    React.useEffect(() => {
        switchRef.current!.checked = defaultState
    }, [defaultState])

    return <mdui-list-item disabled={disabled ? true : undefined} rounded icon={icon} onClick={() => {
        switchRef.current!.checked = !switchRef.current!.checked
        updater(switchRef.current!.checked)
    }}>
        {title}
        {description && <span slot="description">{description}</span>}
        <mdui-switch slot="end-icon" checked-icon="" ref={switchRef} onClick={(e) => e.preventDefault()}></mdui-switch>
    </mdui-list-item>
}