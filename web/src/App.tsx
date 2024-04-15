import { RouterProvider } from 'react-router-dom'
import router from './router'
import { App, ConfigProvider, Spin, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

import './App.css'
import isBrowserDarkTheme from './isBrowserDarkTheme'
import i18n from './locale'

function detectLanguage() {
  switch (i18n.language) {
    case 'zh-CN':
    case 'zh':
      return zhCN
    default:
      return enUS
  }
}

function ReactApp() {
  document.title = 'reCoreD-UI'
  const themeUsed = isBrowserDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm

  return (
    <ConfigProvider theme={{ algorithm: themeUsed }} locale={detectLanguage()}>
      <App>
        <RouterProvider router={router} fallbackElement={<Spin size='large' />} />
      </App>
    </ConfigProvider>
  )
}

export default ReactApp
