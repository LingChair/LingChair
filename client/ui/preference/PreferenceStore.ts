import React from 'react'

export default class PreferenceStore {
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
    setOnUpdate(onUpdate) {
        this.onUpdate = onUpdate
    }
}
