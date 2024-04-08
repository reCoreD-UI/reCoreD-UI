<template>
    <NModal :mask-closable="false" preset="card" style="width: 600px" role="dialog" aria-modal="true" :show="show">
        <template #header>
            <span v-if="!domain || domain.id < 1">{{ t('common.new') }}</span><span v-else>{{ t('common.edit') }}</span><span>{{
                t('domains._') }}</span>
        </template>

        <NForm :model="domain" :rules="rules">
            <NFormItem :label="t('domains._')" path="domain_name">
                <NInput placeholder="example.com" v-model:value="domain?.domain_name" @update:value="easyInput" />
            </NFormItem>
            <NFormItem :label="t('domains.form.mainDNS')" path="main_dns">
                <NInput placeholder="ns1.example.com" v-model:value="domain?.main_dns" />
            </NFormItem>
            <NFormItem :label="t('domains.form.adminMail')" path="admin_email">
                <NInput placeholder="admin@example.com" v-model:value="domain?.admin_email" />
            </NFormItem>
            <NFormItem :label="t('records.refesh')" path="refresh_interval">
                <NInputNumber v-model:value="domain?.refresh_interval">
                    <template #suffix>
                        {{ t('domains.form.unitForSecond') }}
                    </template>
                </NInputNumber>
            </NFormItem>
            <NFormItem :label="t('records.retry')" path="retry_interval">
                <NInputNumber v-model:value="domain?.retry_interval">
                    <template #suffix>
                        {{ t('domains.form.unitForSecond') }}
                    </template>
                </NInputNumber>
            </NFormItem>
            <NFormItem :label="t('records.expire')" path="expiry_period">
                <NInputNumber v-model:value="domain?.expiry_period">
                    <template #suffix>
                        {{ t('domains.form.unitForSecond') }}
                    </template>
                </NInputNumber>
            </NFormItem>
            <NFormItem :label="t('records.ttl')" path="negative_ttl">
                <NInputNumber v-model:value="domain?.negative_ttl">
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
                    <NButton size="small" type="primary" :disabled="loading || invalidData" @click="confirm">
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
    </NModal>
</template>

<script setup lang="ts">
import { useDomainStore, type Domain } from '@/stores/domains';
import { Check, Times } from '@vicons/fa';
import {
    NModal,
    NForm,
    NFormItem,
    NButton,
    NInput,
    NInputNumber,
    useNotification,
    type FormRules,
    type FormItemRule
} from 'naive-ui'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const props = defineProps<{
    domain: Domain
}>()

const show = defineModel<boolean>('show', { default: false })
const loading = defineModel<boolean>('loading', { default: false })
const invalidData = defineModel<boolean>('invalidData', { default: false })
const rules = defineModel<FormRules>('rules')
rules.value = {
    domain_name: {
        required: true,
        trigger: 'blur',
        validator(_rule: FormItemRule, value: string) {
            return validate(
                value,
                /([\w-]+\.)+[\w-]+/,
                'domains.errors.domainName'
            )
        }
    },
    main_dns: {
        required: true,
        trigger: 'blur',
        validator(_rule: FormItemRule, value: string) {
            return validate(
                value,
                /([\w-]+\.)+[\w-]+/,
                'domains.errors.domainName'
            )
        }
    },
    admin_email: {
        required: true,
        trigger: 'blur',
        validator(_rule: FormItemRule, value: string) {
            return validate(
                value,
                /[\w-.]+@([\w-]+\.)+[\w-]+/,
                'domains.errors.mail'
            )
        }
    },
    refresh_interval: {
        required: true,
        trigger: 'blur',
        type: 'number'
    },
    retry_interval: {
        required: true,
        trigger: 'blur',
        type: 'number'
    },
    expiry_period: {
        required: true,
        trigger: 'blur',
        type: 'number'
    },
    negative_ttl: {
        required: true,
        trigger: 'blur',
        type: 'number'
    }
}

const domainStore = useDomainStore()
const notification = useNotification()

async function confirm() {

}

function validate(value: string, reg: RegExp, msg: string) {
    invalidData.value = true
    if (!value) {
        return new Error(t('common.mandatory'))
    } else if (!reg.test(value)) {
        return new Error(t(msg))
    }
    invalidData.value = false
    return true
}

function easyInput(domain: string) {
    props.domain.admin_email = `admin@${domain}`
    props.domain.main_dns = `ns1.${domain}`
}
</script>