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
            <NPopconfirm @positive-click="confirm">
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
import { NButton, NButtonGroup, NTooltip, NIcon, NPopconfirm, NFlex, useNotification } from 'naive-ui'
import { TrashAlt, EditRegular } from '@vicons/fa'
import { useI18n } from 'vue-i18n';
import { useRecordStore, type Record } from '@/stores/records';
import { getErrorInfo } from '@/apis/api';
const { t } = useI18n()
const recordStore = useRecordStore()
const notification = useNotification()
const props = defineProps<{
    record: Record
    domain: string
}>();

const emit = defineEmits(['record-delete'])

function confirm() {
    emit('record-delete', props.domain, props.record)
}
</script>