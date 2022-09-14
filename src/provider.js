import React, { createContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";

export const LanguageContext = createContext()


/**
 * Context Provider with initialization and language settings. Should likely
 * be placed at top level of the app if only one LanguagProvider is needed.
 * @param {*} children List of jsx components. Do not pass this manually, simply
 * wrap your app using the Language Provider.
 * @param {Array<string>} languages List of language names that should be available
 * in the app. Example: ['en', 'jp', 'de']. Avoid names that are the same as html or
 * jsx tags, if you are planning to use the inline LanguageDisplay component.
 * @param {string} init The language that the website should be initially loaded in.
 * Will not do anything, if another language is stored locally and the app set to remember.
 * Should correspond to the names used in the languages list.
 * @param {string} defaultTo The language the display components should default to in case
 * of a text not being available in a selected language. Should correspond to the names used
 * in the languages list.
 * @param {Set<any>} json JSON object containing language content, settings, and/or header/meta
 * information. Any settings and header object is overwritten by any other props defined here. View
 * github for example setups.
 * @param {string} id Identifier for this specific language provider. Used to differentiate local
 * storage in the case of multiple language providers in the same app. If you only use one language
 * provider in your app, it is not required.
 * @param {boolean} remember Set this to true to have the language provider save the user's
 * selected language in localStorage.
 * @param {Set<any>} header Set of header and meta information for display in multiple languages.
 * View github for example setups.
 * @returns {jsx}
 */
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
    const providerId = id || json?.id || ''
    const languageList = languages || json?.languages || ['en']
    const initialLanguage = init || json?.init || 'en'
    const content = json?.content || {}
    remember = remember ? true : (json?.remember ? json.remember : false)
    header = header || json?.header || {}

    const [lang, setLanguage] = useState(initialLanguage)

    const language = () => { return lang }

    const localId = () => { return `lang-${providerId ? providerId : 0}` }

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
    // Local Storage Fetch Effect
    useEffect(() => {
        if (remember) {
            const initFromLocal = localStorage.getItem(localId())
            if (initFromLocal)
                setLanguage(initFromLocal)
        }
    }, [])

    // Local and Session Storage Update Effect
    useEffect(() => {
        if (remember)
            localStorage.setItem(localId(), lang)

        sessionStorage.setItem(localId(), lang)
        window.dispatchEvent(new Event("storage"))
    }, [lang])

    /*
    * SESSION STORAGE HANDLING ------------------------------------------
    * To trade info with language hook
    */
    const updateLang = () => {
        const input = sessionStorage.getItem(localId())
        setLanguage(input)
    }
    useEffect(() => {
        window.addEventListener('storage', updateLang)
        return () => {
            window.removeEventListener('storage', updateLang)
        }
    })

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