<template>
    <NFlex justify="end">
        <NButtonGroup>
            <NTooltip>
                <template #trigger>
                    <NButton size="tiny">
                        <template #icon>
                            <NIcon :component="EditRegular" />
                        </template>
                    </NButton>
                </template>
                {{ $t("common.edit") }}
            </NTooltip>
            <NPopconfirm>
                <template #trigger>
                    <NButton type="error" size="tiny">
                        <template #icon>
                            <NIcon :component="TrashAlt" />
                        </template>
                    </NButton>
                </template>
                {{ $t("common.deleteConfirm") }}
            </NPopconfirm>
        </NButtonGroup>
    </NFlex>
</template>

<script setup lang="ts">
import { NButton, NButtonGroup, NTooltip, NIcon, NPopconfirm, NFlex } from 'naive-ui'
import { TrashAlt, EditRegular } from '@vicons/fa'
import { useI18n } from 'vue-i18n';
import type { Record } from '@/stores/records';
const { t } = useI18n()
const props = defineProps<{
    record: Record
}>();
</script>