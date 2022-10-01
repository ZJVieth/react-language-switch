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

    const windowGlobal = typeof window !== 'undefined' && window

    /*
    * EXPLICIT INITIALIZATION ------------------------------------------
    */
    const providerId = id || json?.id || ''
    const languageList = languages || json?.languages || ['en']
    const initialLanguage = init || json?.init || 'en'
    const content = json?.content || {}
    remember = remember ? true : (json?.remember ? json.remember : false)
    header = header || json?.header || {}
    defaultTo = defaultTo || json?.defaultTo || initialLanguage

    json = {
        id: providerId,
        languages: languageList,
        init: initialLanguage,
        defaultTo,
        remember,
        content,
        header
    }

    const [lang, setLanguage] = useState(initialLanguage)
    const [jsonData, setJsonData] = useState(json)

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
            const initFromLocal = windowGlobal.localStorage.getItem(localId())
            if (initFromLocal)
                setLanguage(initFromLocal)
        }

        windowGlobal.sessionStorage.setItem(`${localId()}-json`, JSON.stringify(jsonData))
    }, [])

    // Local and Session Storage Update Effect
    useEffect(() => {
        if (remember)
            windowGlobal.localStorage.setItem(localId(), lang)

        windowGlobal.sessionStorage.setItem(localId(), lang)
        windowGlobal.sessionStorage.setItem(`${localId()}-json`, JSON.stringify(jsonData))
        windowGlobal.dispatchEvent(new Event("storage"))
    }, [lang])

    /*
    * SESSION STORAGE HANDLING ------------------------------------------
    * To trade info with language hook
    */
    const updateLang = () => {
        const lang_in = windowGlobal.sessionStorage.getItem(localId())
        const json_in = JSON.parse(windowGlobal.sessionStorage.getItem(`${localId()}-json`))
        setLanguage(lang_in)
        setJsonData(json_in)
    }
    useEffect(() => {
        windowGlobal.addEventListener('storage', updateLang)
        return () => {
            windowGlobal.removeEventListener('storage', updateLang)
        }
    })

    /*
    * RENDERING / PASSING ---------------------------------------------
    */
    return (
        <React.Fragment>
            <Helmet>
                {(jsonData?.header?.title) ?
                    <title>{jsonData.header.title[language()]}</title>
                    : null
                }
                {(jsonData?.header?.meta) ?
                    jsonData.header.meta.map(metaObj => {
                        let useLang = null
                        Object.keys(metaObj).forEach(key => {
                            if (key === language())
                                useLang = key
                        })
                        if (!useLang)
                            useLang = defaultTo
                        return <meta key={metaObj.name} name={metaObj.name} content={metaObj[useLang]} />
                    })
                    : null
                }
            </Helmet>
            <LanguageContext.Provider
                value={{
                    language,
                    setLanguage,
                    defaultTo: jsonData?.defaultTo,
                    initialLanguage: jsonData?.init,
                    languageList: jsonData?.languages,
                    content: jsonData?.content,
                    providerId: jsonData?.id,
                    remember: jsonData?.remember,
                    header: jsonData?.header
                }}
            >{children}</LanguageContext.Provider>
        </React.Fragment>
    )

}