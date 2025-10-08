import React from 'react'

export default class PreferenceStore<T extends object> {
    declare onUpdate: (value: T) => void
    declare state: T
    declare setState: React.Dispatch<React.SetStateAction<T>>
    constructor() {
        const _ = React.useState({} as T)
        this.state = _[0]
        this.setState = _[1]
    }

    createUpdater() {
        return (key: string, value: unknown) => {
            const newValue = {
                ...this.state,
                [key]: value,
            }
            this.setState(newValue)
            this.onUpdate?.(newValue)
        }
    }
    setOnUpdate(onUpdate: (value: T) => void) {
        this.onUpdate = onUpdate
    }
}
