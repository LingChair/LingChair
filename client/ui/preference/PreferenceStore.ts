import React from 'react'

export default class PreferenceStore<T extends object> {
    declare value: T
    declare setter: React.Dispatch<React.SetStateAction<T>>
    declare onUpdate: (value: unknown) => void
    constructor() {
        const _ = React.useState<T>({} as T)
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
