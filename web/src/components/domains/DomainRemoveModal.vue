<template>
    <NModal :mask-closable="false" :show="show">
        <NCard role="dialog" aria-modal="true" style="width: 600px">
            <template #header>
                <NIcon class="icon-down" color="red">
                    <QuestionCircle />
                </NIcon>
                {{ t('domains.delete') }} - {{ domain?.domain_name }}
            </template>
            <p>{{ t('common.deleteConfirm') }}</p>
            <p>{{ t('domains.deleteHint') }}</p>
            <p>{{ t('domains.confirm1') }} <b id="boldit">{{ domain?.domain_name }}</b> {{ t('domains.confirm2') }}</p>
            <br />
            <p>
                <NInput v-model:value="domain_name" :placeholder="domain?.domain_name" />
            </p>
            <template #action>
                <NFlex justify="end">
                    <NButton size="small" @click="show = false">
                        <template #icon>
                            <NIcon>
                                <Times />
                            </NIcon>
                        </template>
                        {{ t('common.cancel') }}
                    </NButton>
                    <NSpin :show="loading">
                        <NButton size="small" type="error" :disabled="(domain_name !== domain?.domain_name) || loading"
                            @click="confirm">
                            <template #icon>
                                <NIcon>
                                    <TrashAlt />
                                </NIcon>
                            </template>
                            {{ t('common.confirm') }}
                        </NButton>
                    </NSpin>
                </NFlex>
            </template>
        </NCard>
    </NModal>
</template>

<script setup lang="ts">
import { useDomainStore, type Domain } from '@/stores/domains';
import { NModal, NCard, NFlex, NButton, NIcon, NInput, NSpin, useNotification } from 'naive-ui'
import { Times, TrashAlt, QuestionCircle } from '@vicons/fa';

import { useI18n } from 'vue-i18n';
import { getErrorInfo } from '@/apis/api';
import { ref } from 'vue';
const { t } = useI18n()

const show = defineModel<boolean>('show', { default: false })
const domain_name = ref<string>('')
const loading = ref<boolean>(false)
const domainStore = useDomainStore()
const notification = useNotification()

const props = defineProps<{
    domain: Domain
}>()

async function confirm() {
    domain_name.value = '';
    loading.value = true;

    if (props.domain) {
        try {
            await domainStore.removeDomain(props.domain)
            show.value = false;
        } catch (e) {
            const msg = getErrorInfo(e)
            notification.error(msg)
        }
    }
    loading.value = false;
}
</script>

<style scoped>
.icon-down {
    transform: translateY(2px);
}

b#boldit {
    font-weight: bold;
}
</style>