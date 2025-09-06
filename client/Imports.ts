import * as React from 'https://esm.sh/react@18.3.1'
import * as ReactDOM from 'https://esm.sh/react-dom@18.3.1'
import * as CryptoES from './static/crypto-es-3.1.0.static.mjs'

import type { Dialog } from 'https://unpkg.com/mdui@2.1.4/components/dialog/index.d.ts'
import type { TextField } from 'https://unpkg.com/mdui@2.1.4/components/text-field/index.d.ts'
import type { Button } from 'https://unpkg.com/mdui@2.1.4/components/button/index.d.ts'
import type { NavigationRail } from 'https://unpkg.com/mdui@2.1.4/components/navigation-rail/navigation-rail.d.ts'

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicAttributes {
                id?: string
            }
        }
    }
}

export {
    React,
    ReactDOM,
    CryptoES,

    Dialog as MduiDialog,
    TextField as MduiTextField,
    Button as MduiButton,
    NavigationRail as MduiNavigationRail,
}
