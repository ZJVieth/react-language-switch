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

    const updateLang = () => {
        const input = sessionStorage.getItem(`lang-${id ? id : 0}`)
        setLang(input)
    }

    useEffect(() => {
        sessionStorage.setItem(`lang-${id ? id : 0}`, lang)
        window.dispatchEvent(new Event('storage'))
    }, [lang])

    useEffect(() => {
        window.addEventListener('storage', updateLang)
        return () => {
            window.removeEventListener('storage', updateLang)
        }
    })

    return {
        get: () => { return lang },
        set: setLang
    }
}