import { createI18n } from "vue-i18n";
import zhCN from "./zh-CN";
import enUS from "./en-US";

export default createI18n({
    locale: navigator.language,
    legacy: false,
    messages: {
        zh: {
            ...zhCN
        },
        'zh-CN': {
            ...zhCN
        },

        en: {
            ...enUS
        },
        'en-US': {
            ...enUS
        }
    }
})