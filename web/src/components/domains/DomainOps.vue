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
                {{ t('domains.dnsRecord') }}
            </NTooltip>
            <NTooltip trigger="hover">
                <template #trigger>
                    <NButton size="tiny">
                        <template #icon>
                            <NIcon :component="EditRegular" @click="editDomain" />
                        </template>
                    </NButton>
                </template>
                {{ t('common.edit') }}
            </NTooltip>
            <NTooltip trigger="hover">
                <template #trigger>
                    <NButton type="error" size="tiny">
                        <template #icon>
                            <NIcon :component="TrashAlt" @click="removeDomain"/>
                        </template>
                    </NButton>
                </template>
                {{ t('common.delete') }}
            </NTooltip>
        </NFlex>
    </div>
</template>

<script setup lang="ts">
import { NSpace, NButton, NIcon, NTooltip, NFlex } from 'naive-ui'
import { TrashAlt, EditRegular, Book } from '@vicons/fa'
import { type Domain } from "../../stores/domains"
import router from '@/router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const props = defineProps<{
    domain: Domain
}>()

const emit = defineEmits(['remove-domain', 'edit-domain'])

function loadRecord() {
    router.push(`/records/${props.domain.domain_name}`)
}

function removeDomain() {
    emit('remove-domain', props.domain)
}

function editDomain() {
    emit('edit-domain', props.domain)
}
</script>