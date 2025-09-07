/**
 * @callback callback
 * @param { Event } event 
 */

import * as React from 'react'

/**
 * 绑定事件
 * @param { React.Ref } ref 
 * @param { String } eventName 
 * @param { callback } callback 
 */
export default function useEventListener(ref, eventName, callback) {
    React.useEffect(() => {
        ref.current.addEventListener(eventName, callback)
        return () => ref.current.removeEventListener(eventName, callback)
    }, [ref, eventName, callback])
}
