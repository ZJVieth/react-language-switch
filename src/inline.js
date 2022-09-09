import React from "react"
import { LanguageContext } from "./provider"

export function LanguageDisplay({ children }) {
    return (
        <LanguageContext.Consumer>
            {langVal => {
                if (!children)
                    return
                if (!children.length)
                    children = [children]

                let out = []
                let useLang = null
                for (let tag of children)
                    if (langVal.language() === tag.type)
                        useLang = langVal.language()
                if (!useLang)
                    useLang = langVal.defaultTo

                let i = 0
                for (let tag of children) {
                    if (langVal.languageList.includes(tag.type)) {
                        if (useLang === tag.type)
                            out.push(
                                <span key={i}>{tag.props.children}</span>
                            )
                    } else {
                        if (typeof (tag) === "object" && tag.type !== "br") {
                            const elem = React.createElement(
                                tag.type,
                                { key: i },
                                <LanguageDisplay>{tag.props.children}</LanguageDisplay>
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
            }}
        </LanguageContext.Consumer >
    )
}


export function LanguageSelect({ children }) {
    return (
        <LanguageContext.Consumer>
            {langVal => {
                if (!children)
                    return
                if (!children.length)
                    children = [children]

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