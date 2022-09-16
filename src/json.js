import React from 'react'
import { LanguageContext } from 'react-language-switch'

/**
 * 
 * @param {string} name Name of the field to be rendered as defined
 * in the provider's json object's content section. If it cannot find
 * a field for the selected language, it will instead try to render 
 * the field using the default language.
 * @returns {jsx}
 */
export default function LanguageText({ name }) {

    if (!name)
        throw 'The LanguageText component requires a "name" property corresponding to a key in your content object.';

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

