import React from 'react'

export default class PreferenceStore {
    declare value: { [key: string]: unknown }
    declare setter: React.Dispatch<React.SetStateAction<{ [key: string]: unknown }>>
    declare onUpdate: (value: unknown) => void
    constructor() {
        const _ = React.useState<{ [key: string]: unknown }>({})
        this.value = _[0]
        this.setter = _[1]
    }
    // 创建一个用于子选项的更新函数
    updater(key: string) {
        return (value: unknown) => {
            const newValue = JSON.parse(JSON.stringify({
                ...this.value,
                [key]: value,
            }))
            this.setter(newValue)
            this.onUpdate?.(newValue)
        }
    }
    setOnUpdate(onUpdate: (value: unknown) => void) {
        this.onUpdate = onUpdate
    }
}
