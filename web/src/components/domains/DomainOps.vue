<template>
    <div>
        <NFlex justify="end">
            <NTooltip trigger="hover">
                <template #trigger>
                    <NButton size="tiny" type="primary">
                        <template #icon>
                            <NIcon :component="Book" @click="loadRecord" />
                        </template>
                    </NButton>
                </template>
                查看/修改记录
            </NTooltip>
            <NTooltip trigger="hover">
                <template #trigger>
                    <NButton size="tiny">
                        <template #icon>
                            <NIcon :component="EditRegular" />
                        </template>
                    </NButton>
                </template>
                修改
            </NTooltip>
            <NTooltip trigger="hover">
                <template #trigger>
                    <NButton type="error" size="tiny">
                        <template #icon>
                            <NIcon :component="TrashAlt" />
                        </template>
                    </NButton>
                </template>
                删除
            </NTooltip>
        </NFlex>
    </div>
</template>

<script setup lang="ts">
import { NSpace, NButton, NIcon, NTooltip, NFlex } from 'naive-ui'
import { TrashAlt, EditRegular, Book } from '@vicons/fa'
import { type Domain } from "../../stores/domains"
import router from '@/router';

const props = defineProps<{
    domain: Domain
}>()

function loadRecord() {
    router.push(`/records/${props.domain.domain_name}`)
}
</script>