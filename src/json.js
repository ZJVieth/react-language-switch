import React from 'react'
import { LanguageContext } from 'react-language-switch'

export default function LanguageText({ name }) {
    return (
        <LanguageContext.Consumer>
            {langVal => {
                let out = langVal.content[name][langVal.language()]
                if (!out)
                    out = langVal.content[name][langVal.defaultTo]
                return out
            }}
        </LanguageContext.Consumer>
    )
}

