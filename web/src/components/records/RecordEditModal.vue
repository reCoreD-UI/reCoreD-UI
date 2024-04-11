<template>
    <NModal :mask-closable="false" :show="show">
        <NCard style="width: 640px" role="dialog" aria-modal="true">
            <template #header>
                <span v-if="!record || !record.id || record.id < 1">{{ t('common.new') }}</span><span v-else>{{
                    t('common.edit') }}</span><span>{{ t('records._') }}</span>
            </template>

            <NForm :model="record" inline :rules="rules">
                <NFormItem :label="t('records.recordType')">
                    <NSelect v-model:value="record.record_type" :options="recordTypeOptions"
                        @update:value="clearRecordContent" style="width: 8vw;" />
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
            <NForm :model="record" inline :rules="rules">
                <!-- A or AAAA -->
                <NFormItem :label="t('records.content')"
                    v-if="[RecordTypes.RecordTypeA, RecordTypes.RecordTypeAAAA].indexOf(record.record_type) > -1"
                    path="ip">
                    <NInput v-model:value="(record.content as ARecord | AAAARecord).ip" placeholder="IP" />
                </NFormItem>

                <!-- CNAME or NS -->
                <NFormItem :label="t('records.content')"
                    v-if="[RecordTypes.RecordTypeCNAME, RecordTypes.RecordTypeNS].indexOf(record.record_type) > -1"
                    path="host">
                    <NInput v-model:value="(record.content as CNAMERecord | NSRecord).host"
                        :placeholder="t('records.form.host')" />
                </NFormItem>

                <!-- TXT -->
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeTXT === record.record_type"
                    path="txt">
                    <NInput v-model:value="(record.content as TXTRecord).text" :placeholder="t('records.form.text')" />
                </NFormItem>

                <!-- MX -->
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeMX === record.record_type"
                    path="mx">
                    <NInputGroup>
                        <NInput :placeholder="t('records.form.host')" v-model:value="(record.content as MXRecord).host"
                            style="width: 75%;" />
                        <NInputNumber :placeholder="t('records.form.preference')"
                            v-model:value="(record.content as MXRecord).preference" style="width: 25%;"
                            :show-button="false" />
                    </NInputGroup>
                </NFormItem>

                <!-- SRV -->
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeSRV === record.record_type"
                    path="srv">
                    <NInputGroup>
                        <NInputNumber :placeholder="t('records.form.priority')"
                            v-model:value="(record.content as SRVRecord).priority" style="width: 15%;"
                            :show-button="false" />
                        <NInputNumber :placeholder="t('records.form.weight')"
                            v-model:value="(record.content as SRVRecord).weight" style="width: 15%;"
                            :show-button="false" />
                        <NInputNumber :placeholder="t('records.form.port')"
                            v-model:value="(record.content as SRVRecord).port" style="width: 15%;" :min="0" :max="65535"
                            :show-button="false" />
                        <NInput :placeholder="t('records.form.target')"
                            v-model:value="(record.content as SRVRecord).target" style="width: 55%;" />
                    </NInputGroup>
                </NFormItem>

                <!-- CAA -->
                <NFormItem :label="t('records.content')" v-if="RecordTypes.RecordTypeCAA === record.record_type"
                    path="caa">
                    <NInputGroup>
                        <NInputNumber :placeholder="t('records.form.flag')"
                            v-model:value="(record.content as CAARecord).flag" style="width: 20%;"
                            :show-button="false" />
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

                    <NButton size="small" type="primary" :loading="loading" :disabled="invalidData !== (validationFlags.content | validationFlags.name)" @click="confirm" attr-type="submit">
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
    NIcon,
    useNotification,
    type FormRules,
    type SelectOption,
    type FormItemRule,
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
    type RecordT,
} from '@/stores/records';
import { Check, Times } from '@vicons/fa';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const enum validationFlags {
    name = 1,
    content = name << 1
}

const { t } = useI18n()
const props = defineProps<{
    record: Record,
    domain: string,
}>()
const emit = defineEmits(['reload-records'])

const invalidData = ref(validationFlags.content)
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
        trigger: 'blur',
        validator() {
            invalidData.value |= validationFlags.name
            if (!props.record.name || props.record.name === '') {
                invalidData.value &= ~validationFlags.name
                return new Error(t('common.mandatory'))
            }

            if (props.record.name.includes(' ')) {
                invalidData.value &= ~validationFlags.name
                return new Error(t('records.errors.hasSpace'))
            }

            if (props.record.name.startsWith('.') || props.record.name.endsWith('.')) {
                invalidData.value &= ~validationFlags.name
                return new Error(t('records.errors.badName.dotAndMinus'))
            }

            if (props.record.name.startsWith('-') || props.record.name.endsWith('-')) {
                invalidData.value &= ~validationFlags.name
                return new Error(t('records.errors.badName.dotAndMinus'))
            }

            if (props.record.name.includes('..')) {
                invalidData.value &= ~validationFlags.name
                return new Error(t('records.errors.badName.doubleDots'))
            }

            if (props.record.name.split('.').filter(e => e.length > 63).length > 0) {
                invalidData.value &= ~validationFlags.name
                return new Error(t('records.errors.badName.longerThan63'))
            }
            return true
        }
    },
    txt : {
        trigger: 'blur' ,
        validator() {
            invalidData.value |= validationFlags.content
            if (props.record.record_type !== RecordTypes.RecordTypeTXT) return true

            const r = (props.record.content as TXTRecord)
            if (!r || !r.text || r.text === '') {
                invalidData.value &= ~validationFlags.content
                return new Error(t('common.mandatory'))
            }

            return true
        }
    },
    host: {
        trigger: 'blur',
        validator() {
            invalidData.value |= validationFlags.content
            if ([RecordTypes.RecordTypeCNAME, RecordTypes.RecordTypeNS].indexOf(props.record.record_type) === -1) return true

            const r = (props.record.content as CNAMERecord | NSRecord)
            if (!r || !r.host || r.host === '') {
                invalidData.value &= ~validationFlags.content
                return new Error(t('common.mandatory'))
            }

            if (r.host.includes(' ')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.hasSpace'))
            }

            if (!r.host.endsWith('.')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.endWithDot'))
            }

            return true
        }
    },
    ip: {
        trigger: 'blur',
        validator() {
            invalidData.value |= validationFlags.content
            if ([RecordTypes.RecordTypeA, RecordTypes.RecordTypeAAAA].indexOf(props.record.record_type) === -1) return true
            const r = (props.record.content as AAAARecord | ARecord)
            if (!r || !r.ip || r.ip === '') {
                invalidData.value &= ~validationFlags.content
                return new Error(t('common.mandatory'))
            }

            switch (props.record.record_type) {
                case RecordTypes.RecordTypeA:
                    if (!/^((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/.test(r.ip)) {
                        invalidData.value &= ~validationFlags.content
                        return new Error(t('records.errors.badIPv4'))
                    }

                    break
                case RecordTypes.RecordTypeAAAA:
                    if (!/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(r.ip)) {
                        invalidData.value &= ~validationFlags.content
                        return new Error(t('records.errors.badIPv6'))
                    }

                    break
            }

            return true
        }
    },
    mx: {
        trigger: 'blur',
        validator() {
            invalidData.value |= validationFlags.content
            if (props.record.record_type !== RecordTypes.RecordTypeMX) return true
            const r = (props.record.content as MXRecord)

            if (!r || !r.host || !r.preference || r.host === '') {
                invalidData.value &= ~validationFlags.content
                return new Error(t('common.mandatory'))
            }

            if (r.host.includes(' ')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.hasSpace'))
            }

            if (!r.host.endsWith('.')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.endWithDot'))
            }

            return true
        }
    },
    srv: {
        trigger: 'blur',
        validator() {
            invalidData.value |= validationFlags.content
            if (props.record.record_type !== RecordTypes.RecordTypeSRV) return true
            const r = (props.record.content as SRVRecord)

            if (!r || !r.port || !r.priority || !r.weight || !r.target || r.target === '') {
                invalidData.value &= ~validationFlags.content
                return new Error(t('common.mandatory'))
            }

            if (r.target.includes(' ')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.hasSpace'))
            }

            if (!r.target.endsWith('.')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.endWithDot'))
            }

            return true
        }
    },
    caa: {
        trigger: 'blur',
        validator() {
            invalidData.value |= validationFlags.content
            if (props.record.record_type !== RecordTypes.RecordTypeCAA) return true
            const r = (props.record.content as CAARecord)

            if (!r || !r.flag || !r.tag || r.tag === '' || !r.value || r.value === '') {
                invalidData.value &= ~validationFlags.content
                return new Error(t('common.mandatory'))
            }

            if (r.tag.includes(' ')) {
                invalidData.value &= ~validationFlags.content
                return new Error(t('records.errors.hasSpace'))
            }

            return true
        }
    }
} as FormRules

function clearRecordContent() {
    props.record.content = {} as RecordT
}

async function confirm() {
    loading.value = true;
    try {
        if (!props.record.id || props.record.id < 1) {
            await recordStore.addRecord(props.domain, props.record)
        } else {
            await recordStore.updateRecord(props.domain, props.record)
        }
        emit('reload-records')
        show.value = false
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
        console.error(e)
    }
    loading.value = false;
}
</script>