import { useState, useEffect } from "react"

/**
 * Returns a getter and setter for the current language of the provider
 * identified by the id-parameter. Updates the provider-state via session
 * storage events.
 * @param {*} id Identifier of the LanguageProvider. Can be omitted if only
 * one provider is used. Otherwise should be a string, number or other
 * stringified data format
 * @returns {Set<Function>} Get and set function for the current language.
 */
export default function useLanguage(id) {

    const windowGlobal = typeof window !== 'undefined' && window

    const [lang, setLang] = useState(null)
    const [json, setJson] = useState(null)

    const updateLang = () => {
        const lang_in = windowGlobal.sessionStorage.getItem(`lang-${id ? id : 0}`)
        const json_in = JSON.parse(windowGlobal.sessionStorage.getItem(`lang-${id ? id : 0}-json`))

        setLang(lang_in)
        setJson(json_in)
    }

    useEffect(() => {
        if (lang !== null)
            windowGlobal.sessionStorage.setItem(`lang-${id ? id : 0}`, lang)
        if (json !== null)
            windowGlobal.sessionStorage.setItem(`lang-${id ? id : 0}-json`, JSON.stringify(json))
        windowGlobal.dispatchEvent(new Event('storage'))
    }, [lang, json])

    useEffect(() => {

        if (lang == null)
            setLang(windowGlobal.sessionStorage.getItem(`lang-${id ? id : 0}`))

        windowGlobal.addEventListener('storage', updateLang)
        return () => {
            windowGlobal.removeEventListener('storage', updateLang)
        }
    })

    const getContent = name => {
        let useJson = { ...json }
        if (json == null)
            useJson = JSON.parse(windowGlobal.sessionStorage.getItem(`lang-${id ? id : 0}-json`))

        if (useJson == null)
            return ""

        if (!useJson.content[name])
            return "undefined"

        let out = useJson.content[name][lang]
        if (!out)
            out = useJson.content[name][useJson.defaultTo]
        return out
    }

    const setContent = (name, val) => {
        let newJson = { ...json }
        if (json == null)
            newJson = JSON.parse(windowGlobal.sessionStorage.getItem(`lang-${id ? id : 0}-json`))

        newJson.content[name] = val
        setJson(newJson)
    }

    return {
        get: () => { return lang },
        set: setLang,
        getContent,
        setContent,
    }
}