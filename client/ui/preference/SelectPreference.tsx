import { $ } from 'mdui/jq'
import React from 'react'
import { Dropdown } from 'mdui'
import useEventListener from '../useEventListener.ts'

// value as { [id: string]: string }
export default function SelectPreference({ title, icon, updater, selections, defaultCheckedId, disabled } = {
    disabled: false,
}) {
    const [ checkedId, setCheckedId ] = React.useState(defaultCheckedId)
    
    const dropDownRef = React.useRef<Dropdown>(null)
    const [isDropDownOpen, setDropDownOpen] = React.useState(false)
    
    useEventListener(dropDownRef, 'closed', (e) => {
        setDropDownOpen(false)
    })
    
    return <mdui-list-item icon={icon} rounded disabled={disabled ? true : undefined} onClick={() => setDropDownOpen(!isDropDownOpen)}>
        <mdui-dropdown ref={dropDownRef} trigger="manual" open={isDropDownOpen}>
            <span slot="trigger">{ title }</span>
            <mdui-menu onClick={(e) => {
                e.stopPropagation()
                setDropDownOpen(false)
            }}>
                {
                    Object.keys(selections).map((id) => 
                        <mdui-menu-item selected={checkedId == id ? true : undefined} onClick={() => {
                            setCheckedId(id)
                            updater(id)
                        }}>{selections[id]}</mdui-menu-item>
                    )
                }
            </mdui-menu>
        </mdui-dropdown>
        <span slot="description">{ selections[checkedId] }</span>
    </mdui-list-item>
}