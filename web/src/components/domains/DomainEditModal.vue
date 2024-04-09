<template>
    <NModal :mask-closable="false" :show="show">
        <NCard style="width: 640px" role="dialog" aria-modal="true">
            <template #header>
                <span v-if="!domain || !domain.id || domain.id < 1">{{ t('common.new') }}</span><span v-else>{{
                    t('common.edit')
                    }}</span><span>{{
                        t('domains._') }}</span>
            </template>
            <template #header-extra></template>

            <NForm :model="domain" :rules="rules">
                <NFormItem :label="t('domains._')" path="domain_name">
                    <NInput placeholder="example.com" v-model:value="domain.domain_name" @input="easyInput"
                        @keydown.enter.prevent />
                </NFormItem>
                <NFormItem :label="t('domains.form.mainDNS')" path="main_dns">
                    <NInput placeholder="ns1.example.com" v-model:value="domain.main_dns" @keydown.enter.prevent />
                </NFormItem>
                <NFormItem :label="t('domains.form.adminMail')" path="admin_email">
                    <NInput placeholder="admin@example.com" v-model:value="domain.admin_email" @keydown.enter.prevent />
                </NFormItem>
            </NForm>
            <NForm :model="domain" :rules="rules" inline>
                <NFormItem :label="t('records.refresh')" path="refresh_interval">
                    <NInputNumber v-model:value="domain.refresh_interval" :show-button="false">
                        <template #suffix>
                            {{ t('domains.form.unitForSecond') }}
                        </template>
                    </NInputNumber>
                </NFormItem>
                <NFormItem :label="t('records.retry')" path="retry_interval">
                    <NInputNumber v-model:value="domain.retry_interval" :show-button="false">
                        <template #suffix>
                            {{ t('domains.form.unitForSecond') }}
                        </template>
                    </NInputNumber>
                </NFormItem>
                <NFormItem :label="t('records.expire')" path="expiry_period">
                    <NInputNumber v-model:value="domain.expiry_period" :show-button="false">
                        <template #suffix>
                            {{ t('domains.form.unitForSecond') }}
                        </template>
                    </NInputNumber>
                </NFormItem>
                <NFormItem :label="t('records.ttl')" path="negative_ttl">
                    <NInputNumber v-model:value="domain.negative_ttl" :show-button="false">
                        <template #suffix>
                            {{ t('domains.form.unitForSecond') }}
                        </template>
                    </NInputNumber>
                </NFormItem>
            </NForm>

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
                        <NButton size="small" type="primary" :disabled="loading || invalidData !== allFlags" @click="confirm" attr-type="submit">
                            <template #icon>
                                <NIcon>
                                    <Check />
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
import { getErrorInfo } from '@/apis/api';
import { useDomainStore, type Domain } from '@/stores/domains';
import { Check, Times } from '@vicons/fa';
import {
    NModal,
    NCard,
    NForm,
    NFormItem,
    NFlex,
    NIcon,
    NButton,
    NInput,
    NInputNumber,
    NSpin,
    useNotification,
    type FormRules,
    type FormItemRule
} from 'naive-ui'
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const enum validFlags {
    domainNameValid = 1,
    mainNsValid = domainNameValid << 1,
    adminEmailValid = mainNsValid << 1
}
const allFlags = validFlags.adminEmailValid|validFlags.mainNsValid|validFlags.domainNameValid

const { t } = useI18n()

const props = defineProps<{
    domain: Domain
}>()

const show = defineModel<boolean>('show', { default: false })

const loading = ref(false)
const invalidData = ref(0)
const rules = {
    domain_name: [{
        required: true,
        trigger: 'blur',
        validator: (_rule: FormItemRule, value: string) => {
            return validate(
                value,
                /([\w-]+\.)+[\w-]+/,
                'domains.errors.domainName',
                validFlags.domainNameValid
            )
        }
    }],
    main_dns: [{
        required: true,
        trigger: 'blur',

        validator: (_rule: FormItemRule, value: string) => {
            return validate(
                value,
                /([\w-]+\.)+[\w-]+/,
                'domains.errors.domainName',
                validFlags.mainNsValid,
            )
        }
    }],
    admin_email: [{
        required: true,
        trigger: 'blur',
        validator: (_rule: FormItemRule, value: string) => {
            return validate(
                value,
                /[\w-.]+@([\w-]+\.)+[\w-]+/,
                'domains.errors.mail',
                validFlags.adminEmailValid
            )
        }
    }],
    refresh_interval: [{
        required: true,
        trigger: 'blur',
        type: 'number',
    }],
    retry_interval: [{
        required: true,
        trigger: 'blur',
        type: 'number',
    }],
    expiry_period: [{
        required: true,
        trigger: 'blur',
        type: 'number',
    }],
    negative_ttl: [{
        required: true,
        trigger: 'blur',
    }]
} as FormRules

const domainStore = useDomainStore()
const notification = useNotification()

async function confirm() {
    loading.value = true;
    try {
        if (!props.domain.id || props.domain.id < 1) {
            await domainStore.addDomain(props.domain)
        } else {
            await domainStore.updateDomain(props.domain)
        }
        show.value = false
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
    }
    loading.value = false
}

function validate(value: string, reg: RegExp, msg: string, flag: validFlags): Promise<void> {
    return new Promise<void>((resolve, reject) => { 
        if (!value) {
            invalidData.value &= ~flag
            reject(Error(t('common.mandatory')))
        } else if (!reg.test(value)) {
            invalidData.value &= ~flag
            reject(Error(t(msg)))
        } else {
            invalidData.value |= flag
            resolve()
        }
    })
}

function easyInput(domain: string) {
    props.domain.admin_email = `admin@${domain}`
    props.domain.main_dns = `ns1.${domain}`
}
</script>