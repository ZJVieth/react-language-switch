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

    const [lang, setLang] = useState(sessionStorage.getItem(`lang-${id ? id : 0}`))
    const [json, setJson] = useState(null) //JSON.parse(sessionStorage.getItem(`lang-${id ? id : 0}-json`))

    const updateLang = () => {
        const lang_in = sessionStorage.getItem(`lang-${id ? id : 0}`)
        const json_in = JSON.parse(sessionStorage.getItem(`lang-${id ? id : 0}-json`))

        setLang(lang_in)
        setJson(json_in)
    }

    useEffect(() => {
        if (lang !== null)
            sessionStorage.setItem(`lang-${id ? id : 0}`, lang)
        if (json !== null)
            sessionStorage.setItem(`lang-${id ? id : 0}-json`, JSON.stringify(json))
        window.dispatchEvent(new Event('storage'))
    }, [lang, json])

    useEffect(() => {
        window.addEventListener('storage', updateLang)
        return () => {
            window.removeEventListener('storage', updateLang)
        }
    })

    const getContent = name => {
        let useJson = { ...json }
        if (json == null)
            useJson = JSON.parse(sessionStorage.getItem(`lang-${id ? id : 0}-json`))

        if (!useJson.content[name])
            return "undefined"


        let out = json.content[name][lang]
        if (!out)
            out = json.content[name][json.defaultTo]
        return out
    }

    const setContent = (name, val) => {
        let newJson = { ...json }
        if (json == null)
            newJson = JSON.parse(sessionStorage.getItem(`lang-${id ? id : 0}-json`))

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