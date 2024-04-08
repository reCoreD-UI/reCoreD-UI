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
import { RouterView } from "vue-router";
import { onMounted } from "vue";

const osThemeRef = useOsTheme()
const theme = defineModel<GlobalTheme>()
theme.value = osThemeRef.value === 'dark' ? darkTheme : lightTheme

onMounted(() => {
  document.title = 'reCoreD-UI'
})
</script>

<template>
  <NConfigProvider :theme="theme">
    <NGlobalStyle />
    <NNotificationProvider :max="3">
      <RouterView />
    </NNotificationProvider>
  </NConfigProvider>
</template>
