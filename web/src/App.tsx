import {
    NNotificationProvider,
    NConfigProvider,
    NGlobalStyle,
    useOsTheme,
    darkTheme,
    lightTheme,
} from "naive-ui";

import { zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui'
import { RouterView } from "vue-router";

const osThemeRef = useOsTheme()
const theme = osThemeRef.value === 'dark' ? darkTheme : lightTheme
const locale = navigator.language === "zh-CN" ? zhCN : enUS
const dateLocale = navigator.language === "zh-CN" ? dateZhCN : dateEnUS

function App() {
    document.title = 'reCoreD-UI'
    return (
        <NConfigProvider theme={theme} locale={locale} date-locale={dateLocale}>
            <NGlobalStyle />
            <NNotificationProvider max={3}>
                <RouterView />
            </NNotificationProvider>
        </NConfigProvider>
    )
}

App.displayName = 'App'

export default App