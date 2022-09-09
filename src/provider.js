import React, { createContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";

export const LanguageContext = createContext()


export default function LanguageProvider({
    children,
    languages,
    init,
    defaultTo,
    json,
    id,
    remember,
    header
}) {

    /*
    * EXPLICIT INITIALIZATION ------------------------------------------
    */
    const providerId = id ? id : (json?.id ? json.id : '')
    const languageList = languages ? languages : (json?.languages ? json.languages : ['en'])
    const initialLanguage = init ? init : (json?.init ? json.init : 'en')
    defaultTo = defaultTo ? defaultTo : (json?.defaultTo ? json.defaultTo : initialLanguage)
    const content = json?.content ? json.content : {}
    remember = remember ? true : (json?.remember ? json.remember : false)
    header = header ? header : (json?.header ? json.header : {})

    const [lang, setLanguage] = useState(initialLanguage)

    const language = () => { return lang }

    /*
    * EXTERNAL JSON FETCHING ------------------------------------------
    * WIP
    */
    // useEffect(() => {
    //     if (typeof (json) === "string")
    //         fetch(json)
    //             .then(r => r.text())
    //             .then(text => )
    // }, [])


    /*
    * LOCAL STORAGE HANDLING ------------------------------------------
    */
    const localId = `lang-${providerId ? providerId : 0}`
    // Local Storage Fetch Effect
    useEffect(() => {
        if (remember) {
            const initFromLocal = localStorage.getItem(localId)
            if (initFromLocal)
                setLanguage(initFromLocal)
        }
    }, [])

    // Local Storage Update Effect
    useEffect(() => {
        if (remember)
            localStorage.setItem(localId, lang)
    }, [lang])

    /*
    * RENDERING / PASSING ---------------------------------------------
    */
    return (
        <React.Fragment>
            <Helmet>
                {(header.title) ?
                    <title>{header.title[language()]}</title>
                    : null
                }
                {(header.meta) ?
                    header.meta.map(metaObj => {
                        let useLang = null
                        Object.keys(metaObj).forEach(key => {
                            if (key === language())
                                useLang = key
                        })
                        if (!useLang)
                            useLang = langVal.defaultTo
                        return <meta key={metaObj.name} name={metaObj.name} content={metaObj[useLang]} />
                    })
                    : null
                }
            </Helmet>
            <LanguageContext.Provider
                value={{
                    language,
                    setLanguage,
                    defaultTo,
                    initialLanguage,
                    languageList,
                    content,
                    providerId,
                    remember,
                    header
                }}
            >{children}</LanguageContext.Provider>
        </React.Fragment>
    )

}