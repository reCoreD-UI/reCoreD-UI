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
    type FormRules,
    type SelectOption,
    createDiscreteApi,
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
import { ref, type SetupContext } from 'vue';
import i18n from '@/locale/i18n';

const { t } = i18n.global

const enum validationFlags {
    name = 1,
    content = name << 1
}

type Props = {
    record: Record
    domain: string
    show: boolean
    'onReloadRecords': () => void
    'onUpdate:show': (v: boolean) => void
}

type Events = {
    reloadRecords(): void
    'update:show': (v: boolean) => void
}

const invalidData = ref(validationFlags.content)
const loading = ref(false)
const recordStore = useRecordStore()
const { notification } = createDiscreteApi(['notification'])
const recordTypeOptions = Object.entries(RecordTypes).filter(
    e => e[1] !== RecordTypes.RecordTypeSOA
).map(e => {
    return {
        label: e[1],
        value: e[1]
    } as SelectOption
})

function validateName(_rule: FormItemRule, value: string): boolean | Error {
    invalidData.value |= validationFlags.name
    if (!value || value === '') {
        invalidData.value &= ~validationFlags.name
        return new Error(t('common.mandatory'))
    }

    if (value.includes(' ')) {
        invalidData.value &= ~validationFlags.name
        return new Error(t('records.errors.hasSpace'))
    }

    if (value.startsWith('.') || value.endsWith('.')) {
        invalidData.value &= ~validationFlags.name
        return new Error(t('records.errors.badName.dotAndMinus'))
    }

    if (value.startsWith('-') || value.endsWith('-')) {
        invalidData.value &= ~validationFlags.name
        return new Error(t('records.errors.badName.dotAndMinus'))
    }

    if (value.includes('..')) {
        invalidData.value &= ~validationFlags.name
        return new Error(t('records.errors.badName.doubleDots'))
    }

    if (value.split('.').filter(e => e.length > 63).length > 0) {
        invalidData.value &= ~validationFlags.name
        return new Error(t('records.errors.badName.longerThan63'))
    }
    return true
}

function validateTXTRecord(record: Record) {
    return () => {
        invalidData.value |= validationFlags.content
        if (record.record_type !== RecordTypes.RecordTypeTXT) return true

        const r = (record.content as TXTRecord)
        if (!r || !r.text || r.text === '') {
            invalidData.value &= ~validationFlags.content
            return new Error(t('common.mandatory'))
        }

        return true
    }
}

function validateHostRecord(record: Record) {
    return () => {
        invalidData.value |= validationFlags.content
        if ([RecordTypes.RecordTypeCNAME, RecordTypes.RecordTypeNS].indexOf(record.record_type) === -1) return true

        const r = (record.content as CNAMERecord | NSRecord)
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
}

function validateIPRecord(record: Record) {
    return () => {
        invalidData.value |= validationFlags.content
        if ([RecordTypes.RecordTypeA, RecordTypes.RecordTypeAAAA].indexOf(record.record_type) === -1) return true
        const r = (record.content as AAAARecord | ARecord)
        if (!r || !r.ip || r.ip === '') {
            invalidData.value &= ~validationFlags.content
            return new Error(t('common.mandatory'))
        }

        switch (record.record_type) {
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
}

function validateMXRecord(record: Record) {
    return () => {
        invalidData.value |= validationFlags.content
        if (record.record_type !== RecordTypes.RecordTypeMX) return true
        const r = (record.content as MXRecord)

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
}

function validateSRVRecord(record: Record) {
    return () => {
        invalidData.value |= validationFlags.content
        if (record.record_type !== RecordTypes.RecordTypeSRV) return true
        const r = (record.content as SRVRecord)

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
}

function validateCAARecord(record: Record) {
    return () => {
        invalidData.value |= validationFlags.content
        if (record.record_type !== RecordTypes.RecordTypeCAA) return true
        const r = (record.content as CAARecord)

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

function buildRules(record: Record): FormRules {
    return {
        name: {
            trigger: 'blur',
            validator: validateName
        },
        txt: {
            trigger: 'blur',
            validator: validateTXTRecord(record)
        },
        host: {
            trigger: 'blur',
            validator: validateHostRecord(record)
        },
        ip: {
            trigger: 'blur',
            validator: validateIPRecord(record)
        },
        mx: {
            trigger: 'blur',
            validator: validateMXRecord(record)
        },
        srv: {
            trigger: 'blur',
            validator: validateSRVRecord(record)
        },
        caa: {
            trigger: 'blur',
            validator: validateCAARecord(record)
        }
    }
}

async function confirm(record: Record, domain: string) {
    loading.value = true;
    try {
        if (!record.id || record.id < 1) {
            await recordStore.addRecord(domain, record)
        } else {
            await recordStore.updateRecord(domain, record)
        }
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
        console.error(e)
    }
    loading.value = false;
}

function modalHeader({ record }: Props) {
    return (
        <>
            {(!record || !record.id || record.id < 1) ? <span>{t('common.new')}</span> : <span> {t('common.edit')}</span>}
            <span>{t('records._')}</span>
        </>
    )
}

function modalActions({ record, domain }: Props, { emit }: SetupContext<Events>) {
    return (
        <NFlex justify='end'>
            <NButton size='small' onClick={() => emit('update:show', false)}>
                {{
                    icon: () => <NIcon component={Times} />,
                    default: () => t('common.cancel')
                }}
            </NButton>

            <NButton size='small' type='primary' loading={loading.value} attrType='submit'
                disabled={invalidData.value !== (validationFlags.content | validationFlags.name)}
                onClick={() => confirm(record, domain).then(() => { emit('reloadRecords'); emit('update:show', false) })}>
                {{
                    icon: () => <NIcon component={Check} />,
                    default: () => t('common.confirm')
                }}
            </NButton>
        </NFlex>
    )
}

function modalBody({ record }: Props) {
    const rules = buildRules(record)
    return (
        <>
            <NForm model={record} rules={rules} inline>
                <NFormItem label={t('records.recordType')}>
                    <NSelect value={record.record_type}
                        onUpdate:value={(v) => { record.record_type = v; record.content = {} as RecordT }}
                        options={recordTypeOptions} style={{ width: '8vw' }} />
                </NFormItem>
                <NFormItem label={t('records.name')} path='name'>
                    <NInput value={record.name} onUpdate:value={v => record.name = v} />
                </NFormItem>
                <NFormItem label='TTL' path='ttl'>
                    <NInputNumber value={record.ttl} onUpdate:value={v => v ? record.ttl = v : null} showButton={false} >
                        {{
                            suffix: () => t('common.unitForSecond')
                        }}
                    </NInputNumber>
                </NFormItem>
            </NForm>
            <NForm model={record} rules={rules}>
                <modalBodyContent type={record.record_type} record={record} />
            </NForm>
        </>
    )
}

const IPRecordE = ({ record }: Props) => (
    <NFormItem label={t('records.content')} path='ip'>
        <NInput value={(record.content as ARecord | AAAARecord).ip} onUpdate:value={v => (record.content as ARecord | AAAARecord).ip = v} placeholder='IP' />
    </NFormItem>
)

const HostRecordE = ({ record }: Props) => (
    <NFormItem label={t('records.content')} path='host'>
        <NInput value={(record.content as CNAMERecord | NSRecord).host} onUpdate:value={v => (record.content as CNAMERecord | NSRecord).host = v} placeholder={t('records.form.host')} />
    </NFormItem>
)

const TXTRecordE = ({ record }: Props) => (
    <NFormItem label={t('records.content')} path='txt'>
        <NInput value={(record.content as TXTRecord).text} onUpdateValue={v => (record.content as TXTRecord).text = v} placeholder={t('records.form.text')} />
    </NFormItem>
)

const MXRecordE = ({ record }: Props) => (
    <NFormItem label={t('records.content')} path='mx'>
        <NInputGroup>
            <NInput placeholder={t('records.form.host')}
                value={(record.content as MXRecord).host}
                onUpdate:value={v => (record.content as MXRecord).host = v}
                style={{ width: '75%' }} />
            <NInputNumber placeholder={t('records.form.preference')}
                value={(record.content as MXRecord).preference}
                onUpdate:value={v => v ? (record.content as MXRecord).preference = v : null}
                style={{ width: '25%' }} show-button={false} />
        </NInputGroup>
    </NFormItem>
)

const CAARecordE = ({ record }: Props) => (
    <NFormItem label={t('records.content')} path='caa'>
        <NInputGroup>
            <NInputNumber placeholder={t('records.form.flag')}
                value={(record.content as CAARecord).flag} style={{ width: '20%' }}
                onUpdate:value={v => v ? (record.content as CAARecord).flag = v : null}
                show-button={false} />
            <NInput placeholder={t('records.form.tag')}
                value={(record.content as CAARecord).tag}
                onUpdate:value={v => v ? (record.content as CAARecord).tag = v : null}
                style={{ width: '40%' }} />
            <NInput placeholder={t('records.form.value')}
                value={(record.content as CAARecord).value}
                onUpdate:value={v => v ? (record.content as CAARecord).value = v : null}
                style={{ width: '40%' }} />
        </NInputGroup>
    </NFormItem>
)

const SRVRecordE = ({ record }: Props) => (
    <NFormItem label={t('records.content')} path='srv'>
        <NInputGroup>
            <NInputNumber placeholder={t('records.form.priority')}
                value={(record.content as SRVRecord).priority} style={{ width: '15%' }}
                onUpdateValue={v => v ? (record.content as SRVRecord).priority = v : null}
                show-button={false} />
            <NInputNumber placeholder={t('records.form.weight')}
                value={(record.content as SRVRecord).weight} style={{ width: '15%' }}
                onUpdate:value={v => v ? (record.content as SRVRecord).weight = v : null}
                show-button={false} />
            <NInputNumber placeholder={t('records.form.port')}
                value={(record.content as SRVRecord).port} style={{ width: '15%' }} min={0} max={65535}
                onUpdate:value={v => v ? (record.content as SRVRecord).port = v : null}
                show-button={false} />
            <NInput placeholder={t('records.form.target')}
                value={(record.content as SRVRecord).target} style={{ width: '55%' }}
                onUpdate:value={v => (record.content as SRVRecord).target = v}
            />
        </NInputGroup>
    </NFormItem>
)

const modalBodyContent = ({ type, record }: { type: RecordTypes, record: Record }) => {
    const e = {
        'A': IPRecordE,
        'AAAA': IPRecordE,
        'CNAME': HostRecordE,
        'NS': HostRecordE,
        'TXT': TXTRecordE,
        'MX': MXRecordE,
        'SRV': SRVRecordE,
        'CAA': CAARecordE,
        'SOA': ({ }: Props) => <></>
    }[type]
    return <e record={record} />
}

function RecordEditModal(
    { domain, show, record }: Props,
    { emit }: SetupContext<Events>) {
    return (
        <NModal maskClosable={false} show={show}>
            <NCard style={{ width: '640px' }} role='dialog'>
                {{
                    header: () => <modalHeader record={record} />,
                    default: () => <modalBody record={record} />,
                    action: () => <modalActions record={record} domain={domain}
                        onUpdate:show={(v: boolean) => emit('update:show', v)}
                        onReloadRecords={() => emit('reloadRecords')} />
                }}
            </NCard>
        </NModal>
    )
}

export default RecordEditModal