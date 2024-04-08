<script setup lang="ts">
import {
  NNotificationProvider,
  NConfigProvider,
  NGlobalStyle,
  useOsTheme,
  darkTheme,
  lightTheme,
  type GlobalTheme
} from "naive-ui";
import { zhCN, dateZhCN, enUS, dateEnUS, type NLocale, type NDateLocale } from 'naive-ui'
import { RouterView } from "vue-router";
import { onMounted } from "vue";

const osThemeRef = useOsTheme()
const theme = osThemeRef.value === 'dark' ? darkTheme : lightTheme
const locale = navigator.language === "zh-CN" ? zhCN : enUS
const dateLocale = navigator.language === "zh-CN" ? dateZhCN : dateEnUS

onMounted(() => {
  document.title = 'reCoreD-UI'
})
</script>

<template>
  <NConfigProvider :theme="theme" :locale="locale" :date-locale="dateLocale">
    <NGlobalStyle />
    <NNotificationProvider :max="3">
      <RouterView />
    </NNotificationProvider>
  </NConfigProvider>
</template>
