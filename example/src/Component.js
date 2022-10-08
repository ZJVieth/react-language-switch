import React from 'react'

import { useLanguage } from 'react-language-switch'

export default function Component() {

    const lang = useLanguage('json-example')

    return (
        <div>Component: {lang.get()}</div>
    )
}
