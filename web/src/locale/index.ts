import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import zh from './zh'
import en from './en'

i18n.use(LanguageDetector).use(initReactI18next)
    .init({
        debug: import.meta.env.DEV,
        fallbackLng: 'zh',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: en
            },
            zh: {
                translation: zh
            }
        }
    })

export default i18n