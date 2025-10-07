import React from 'react'
import { Dropdown } from 'mdui'
import useEventListener from '../useEventListener.ts'

interface Args extends React.HTMLAttributes<HTMLElement> {
    title: string
    icon: string
    disabled?: boolean
    updater: (value: unknown) => void
    selections: { [id: string]: string }
    defaultCheckedId: string
}

export default function SelectPreference({ title, icon, updater, selections, defaultCheckedId, disabled }: Args) {
    const [checkedId, setCheckedId] = React.useState(defaultCheckedId)

    const dropDownRef = React.useRef<Dropdown>(null)
    const [isDropDownOpen, setDropDownOpen] = React.useState(false)

    useEventListener(dropDownRef, 'closed', () => {
        setDropDownOpen(false)
    })
    return <mdui-list-item icon={icon} rounded disabled={disabled ? true : undefined} onClick={() => setDropDownOpen(!isDropDownOpen)}>
        <mdui-dropdown ref={dropDownRef} trigger="manual" open={isDropDownOpen}>
            <span slot="trigger">{title}</span>
            <mdui-menu onClick={(e) => {
                e.stopPropagation()
                setDropDownOpen(false)
            }}>
                {
                    Object.keys(selections).map((id) =>
                        // @ts-ignore: selected 确实存在, 但是并不对外公开使用
                        <mdui-menu-item key={id} selected={checkedId == id ? true : undefined} onClick={() => {
                            setCheckedId(id)
                            updater(id)
                        }}>{selections[id]}</mdui-menu-item>
                    )
                }
            </mdui-menu>
        </mdui-dropdown>
        <span slot="description">{selections[checkedId]}</span>
    </mdui-list-item>
}