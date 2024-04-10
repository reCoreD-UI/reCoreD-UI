<template>
    <NModal :mask-closable="false" :show="show">
        <NCard style="width: 640px" role="dialog" aria-modal="true">
            <template #header>
                <span v-if="!record || !record.id || record.id < 1">{{ t('common.new') }}</span><span v-else>{{
                    t('common.edit') }}</span><span>{{ t('records._') }}</span>
            </template>

            <NForm :model="record" inline :rules="rules">
                <NFormItem :label="t('records.recordType')">
                    <NSelect v-model:value="record.record_type" :options="recordTypeOptions" />
                </NFormItem>
                <NFormItem :label="t('records.name')" path="name">
                    <NInput v-model:value="record.name" />
                </NFormItem>
                <NFormItem label="TTL" path="ttl">
                    <NInputNumber v-model:value="record.ttl" :show-button="false">
                        <template #suffix>
                            {{ t('common.unitForSecond') }}
                        </template>
                    </NInputNumber>
                </NFormItem>
            </NForm>
            <NForm :model="record" inline>
                <NFormItem :label="t('records.content')"
                    v-if="[RecordTypes.RecordTypeA, RecordTypes.RecordTypeAAAA].indexOf(record.record_type) > -1">
                    <NInput v-model:value="(record.content as ARecord | AAAARecord).ip" placeholder="IP" />
                </NFormItem>
                <NFormItem :label="t('records.content')"
                    v-if="[RecordTypes.RecordTypeCNAME, RecordTypes.RecordTypeNS].indexOf(record.record_type) > -1">
                    <NInput v-model:value="(record.content as CNAMERecord | NSRecord).host"
                        :placeholder="t('records.form.host')" />
                </NFormItem>
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeTXT === record.record_type">
                    <NInput v-model:value="(record.content as TXTRecord).text" :placeholder="t('records.form.text')" />
                </NFormItem>
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeMX === record.record_type">
                    <NInputGroup>
                        <NInput :placeholder="t('records.form.host')" v-model:value="(record.content as MXRecord).host"
                            style="width: 75%;" />
                        <NInputNumber :placeholder="t('records.form.preference')"
                            v-model:value="(record.content as MXRecord).preference" style="width: 25%;" />
                    </NInputGroup>
                </NFormItem>
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeSRV === record.record_type">
                    <NInputGroup>
                        <NInputNumber :placeholder="t('records.form.priority')"
                            v-model:value="(record.content as SRVRecord).priority" style="width: 25%;" />
                        <NInputNumber :placeholder="t('records.form.weight')"
                            v-model:value="(record.content as SRVRecord).weight" style="width: 25%;" />
                        <NInputNumber :placeholder="t('records.form.port')"
                            v-model:value="(record.content as SRVRecord).port" style="width: 25%;" :min="0"
                            :max="65535" />
                        <NInput :placeholder="t('records.form.target')"
                            v-model:value="(record.content as SRVRecord).target" style="width: 25%;" />
                    </NInputGroup>
                </NFormItem>
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeCAA === record.record_type">
                    <NInputGroup>
                        <NInputNumber :placeholder="t('records.form.flag')"
                            v-model:value="(record.content as CAARecord).flag" style="width: 20%;" />
                        <NInput :placeholder="t('records.form.tag')" v-model:value="(record.content as CAARecord).tag"
                            style="width: 40%;" />
                        <NInput :placeholder="t('records.form.value')"
                            v-model:value="(record.content as CAARecord).value" style="width: 40%;" />
                    </NInputGroup>
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

                    <NButton size="small" type="primary" :loading="loading" @click="confirm" attr-type="submit">
                        <template #icon>
                            <NIcon>
                                <Check />
                            </NIcon>
                        </template>
                        {{ t('common.confirm') }}
                    </NButton>
                </NFlex>
            </template>
        </NCard>
    </NModal>
</template>

<script setup lang="ts">
import {
    NModal,
    NCard,
    NForm,
    NFormItem,
    NFlex,
    NButton,
    NInput,
    NInputNumber,
    NInputGroup,
    NSelect,
    useNotification,
    type FormRules,
    type SelectOption
} from 'naive-ui'
import { getErrorInfo } from '@/apis/api';
import {
    useRecordStore,
    RecordTypes,
    type Record,
    type ARecord,
    type AAAARecord,
    type CAARecord,
    type CNAMERecord,
    type NSRecord,
    type SRVRecord,
    type TXTRecord,
    type MXRecord,
} from '@/stores/records';
import { Check, Times } from '@vicons/fa';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const props = defineProps<{
    record: Record,
    domain: string,
}>()

const show = defineModel<boolean>('show', { default: false })
const loading = ref(false)
const notification = useNotification()
const recordStore = useRecordStore()
const recordTypeOptions = Object.entries(RecordTypes).filter(
    e => e[1] !== RecordTypes.RecordTypeSOA
).map(e => {
    return {
        label: e[1],
        value: e[1]
    } as SelectOption
})
const rules = {
    name: {
        required: true,
        trigger: 'blur',
        message: t('common.mandatory')
    }
} as FormRules

async function confirm() {
    loading.value = true;
    try {
        if (!props.record.id || props.record.id < 1) {
            await recordStore.addRecord(props.domain, props.record)
        } else {
            await recordStore.updateRecord(props.domain, props.record)
        }
        show.value = false
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
        console.error(e)
    }
    loading.value = false;
}
</script>