import React, { createContext, useState } from "react";


export const LanguageContext = createContext()


export default function LanguageProvider({ children, languages, init, defaultTo }) {

  defaultTo = defaultTo ? defaultTo : (init ? init : 'en')

  const [lang, setLanguage] = useState(init ? init : 'en')

  const language = () => { return lang }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        defaultTo,
        init,
        languageList: languages
      }}
    >{children}</LanguageContext.Provider>
  )

}

export function LanguageDisplay({ children }) {
  return (
    <LanguageContext.Consumer>
      {langVal => {
        let out = []
        if (!children)
          return
        if (!children.length)
          children = [children]
        for (let tag of children) {
          if (langVal.languageList.includes(tag.type)) {
            if (langVal.language() === tag.type)
              out.push(
                <span key={tag.type}>{tag.props.children}</span>
              )
          } else {
            if (typeof (tag) === "object" && tag.type !== "br") {
              const elem = React.createElement(
                tag.type,
                { key: tag.type },
                <LanguageDisplay>{tag.props.children}</LanguageDisplay>
              )
              out.push(elem)
            }
            else {
              out.push(tag)
            }
          }
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
        let out = []
        if (!children)
          return
        if (!children.length)
          children = [children]
        for (let tag of children) {
          if (langVal.languageList.includes(tag.type)) {
            out.push(
              <span
                key={tag.type}
                onClick={() => langVal.setLanguage(tag.type)}
              >{tag.props.children}</span>
            )
          } else {
            if (typeof (tag) === "object" && tag.type !== "br") {
              const elem = React.createElement(
                tag.type,
                { key: tag.type },
                <LanguageSelect>{tag.props.children}</LanguageSelect>
              )
              out.push(elem)
            }
            else {
              out.push(tag)
            }
          }
        }
        return out
      }
      }
    </LanguageContext.Consumer >
  )
}