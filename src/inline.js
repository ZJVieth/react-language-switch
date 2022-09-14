import React from "react"
import { LanguageContext } from "./provider"

/**
 * React component for inline language display. Children can be any html.
 * Language specific components should be wrapped in corresponding language
 * tags corresponding to the names in the language list of the provider.
 * Examples: "\<en>Hello\</en>\<de>Hallo\</de>"
 * DO NOT NEST LanguageDisplay and LanguageSelect!
 * @param {*} children 
 * @returns {jsx}
 */
export function LanguageDisplay({ children }) {
    return (
        <LanguageContext.Consumer>
            {langVal => {
                // If the component does not wrap anything, there is nothing to display.
                if (!children)
                    return
                // In case of only one child being passed, simply turn it into a list.
                if (!children.length)
                    children = [children]

                let out = []    // List of jsx to be rendered.
                let useLang = null
                // Iterate over child tags at this dom level to see if the selected language
                // is available. If it isn't, use the default language. Therefore, if a text
                // is supposed to only be displayed in one language and none other, simply add
                // void tags for those languages.
                for (let tag of children)
                    if (langVal.language() === tag.type)
                        useLang = langVal.language()
                if (!useLang)
                    useLang = langVal.defaultTo

                // Iterate over all tags at this dom level to display them if they
                // correspond to the selected language.
                let i = 0
                for (let tag of children) {
                    if (langVal.languageList.includes(tag.type)) {
                        if (useLang === tag.type)
                            out.push(
                                <span key={i}>{tag.props.children}</span>
                            )
                    } else {
                        // Non-anguage tags get passed to a recursive LanguageDisplay component
                        // to continue down the dom.
                        if (typeof (tag) === "object" && tag.type !== "br") {
                            const elem = React.createElement(
                                tag.type,
                                { key: i },
                                <LanguageDisplay>{tag.props.children}</LanguageDisplay>
                            )
                            out.push(elem)
                        }
                        else {
                            // No need for recursion for simple non-tag text element. Simply
                            // added to the dom.
                            out.push(tag)
                        }
                    }
                    i++
                }
                return out
            }}
        </LanguageContext.Consumer >
    )
}

/**
 * React component for inline language selection. Children can be any html.
 * Language selector components should be wrapped in corresponding language
 * tags corresponding to the names in the language list of the provider. The
 * children of these tags will then be given an onClick to change the language
 * to the same of their tag.
 * Examples: "\<en>EN\</en> | \<de>DE\</de>"
 * DO NOT NEST LanguageDisplay and LanguageSelect!
 * @param {*} children 
 * @returns {jsx}
 */
export function LanguageSelect({ children }) {
    return (
        <LanguageContext.Consumer>
            {langVal => {
                if (!children)
                    return
                if (!children.length)
                    children = [children]

                // Same recursive render logic as LanguageDisplay component
                // just that children of language tag are wrapped in a clickable
                // span tag.

                let out = []
                let i = 0
                for (let tag of children) {
                    if (langVal.languageList.includes(tag.type)) {
                        out.push(
                            <span
                                key={i}
                                onClick={() => langVal.setLanguage(tag.type)}
                            >{tag.props.children}</span>
                        )
                    } else {
                        if (typeof (tag) === "object" && tag.type !== "br") {
                            const elem = React.createElement(
                                tag.type,
                                { key: i },
                                <LanguageSelect>{tag.props.children}</LanguageSelect>
                            )
                            out.push(elem)
                        }
                        else {
                            out.push(tag)
                        }
                    }
                    i++
                }
                return out
            }
            }
        </LanguageContext.Consumer >
    )
}