<template>
    <NModal :mask-closable="false" :show="show">

    </NModal>
</template>

<script setup lang="ts">
import { NModal } from 'naive-ui'

const props = defineProps<{
    show: boolean
}>()
</script>