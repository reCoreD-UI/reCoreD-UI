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
    type FormRules,
    type FormItemRule,
    createDiscreteApi
} from 'naive-ui'
import { getErrorInfo } from '@/apis/api';
import { useDomainStore, type Domain } from '@/stores/domains';
import { Check, Times } from '@vicons/fa';
import i18n from '@/locale/i18n'
import { ref, type SetupContext } from 'vue';

const { t } = i18n.global
const domainStore = useDomainStore()
const { notification } = createDiscreteApi(['notification'])
const enum validFlags {
    domainNameValid = 1,
    mainNsValid = domainNameValid << 1,
    adminEmailValid = mainNsValid << 1
}
const allFlags = validFlags.adminEmailValid | validFlags.mainNsValid | validFlags.domainNameValid
const rules = {
    domain_name: [{
        required: true,
        trigger: 'blur',
        validator: (_rule: FormItemRule, value: string) => {
            return validate(
                value,
                /^([\w-]+\.)+[\w-]+$/,
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
                /^([\w-]+\.)+[\w-]+$/,
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
                /^[\w-.]+@([\w-]+\.)+[\w-]+$/,
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
        type: 'number'
    }]
} as FormRules


type Props = {
    domain: Domain
    show: boolean
    'onUpdate:show': (v: boolean) => void
}

type Events = {
    'update:show': (v: boolean) => void
    'update:value': (v: string | number | null) => void
}

const loading = ref(false)
const invalidData = ref(0)

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

async function confirm(domain: Domain) {
    loading.value = true;
    try {
        if (!domain.id || domain.id < 1) {
            await domainStore.addDomain(domain)
        } else {
            await domainStore.updateDomain(domain)
        }
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
        console.error(e)
    } finally {
        loading.value = false
    }
}

function easyInput(domain_name: string, domain: Domain) {
    domain.admin_email = `admin@${domain_name}`
    domain.main_dns = `ns1.${domain_name}`
}

function modalHeader({ domain }: Props) {
    return (
        <>
            {(!domain || !domain.id || domain.id < 1) ? <span>{t('common.new')}</span> : <span>{t('common.edit')}</span>}
            <span>{t('domains._')}</span>
        </>
    )
}

function modalInputNumbers({ value, label, path }: { value: number, label: string, path: string }, { emit }: SetupContext<Events>) {
    return (
        <NFormItem label={t(label)} path={path}>
            <NInputNumber value={value} onUpdate:value={v => emit('update:value', v)} showButton={false}>
                {{
                    suffix: () => t('common.unitForSecond')
                }}
            </NInputNumber>
        </NFormItem>
    )
}

function modalBody({ domain }: Props) {
    return (
        <>
            <NForm model={domain} rules={rules}>
                <NFormItem label={t('domains._')} path='domain_name'>
                    <NInput placeholder='example.com' value={domain.domain_name} onUpdate:value={v => domain.domain_name = v} onInput={v => easyInput(v, domain)} />
                </NFormItem>
                <NFormItem label={t('domains.form.mainDNS')} path='main_dns'>
                    <NInput placeholder="ns1.example.com" value={domain.main_dns} onUpdate:value={v => domain.main_dns = v} />
                </NFormItem>
                <NFormItem label={t('domains.form.adminMail')} path='admin_email'>
                    <NInput placeholder="admin@example.com" value={domain.admin_email} onUpdate:value={v => domain.admin_email = v} inputProps={{ type: 'email' }} />
                </NFormItem>
            </NForm>
            <NForm model={domain} rules={rules} inline>
                <modalInputNumbers value={domain.refresh_interval} onUpdate:value={(v: number) => domain.refresh_interval = v} path='refresh_interval' label='records.refresh' />
                <modalInputNumbers value={domain.retry_interval} onUpdate:value={(v: number) => domain.retry_interval = v} path='retry_interval' label='records.retry' />
                <modalInputNumbers value={domain.expiry_period} onUpdate:value={(v: number) => domain.expiry_period = v} path='expiry_period' label='records.expire' />
                <modalInputNumbers value={domain.negative_ttl} onUpdate:value={(v: number) => domain.negative_ttl = v} path='negative_ttl' label='records.ttl' />
            </NForm>
        </>
    )
}

function modalActions({ domain }: Props, { emit }: SetupContext<Events>) {
    return (
        <NFlex justify='end'>
            <NButton size='small' onClick={() => emit("update:show", false)} >
                {{
                    default: () => t('common.cancel'),
                    icon: () => <NIcon><Times /></NIcon>
                }}
            </NButton>

            <NButton size='small' type='primary' disabled={invalidData.value !== allFlags} loading={loading.value} onClick={() => confirm(domain).then(() => emit('update:show', false))} attrType='submit'>
                {{
                    default: () => t('common.confirm'),
                    icon: () => <NIcon><Check /></NIcon>
                }}
            </NButton>
        </NFlex>
    )
}

function DomainEditModal({ domain, show, }: Props, { emit }: SetupContext<Events>) {
    return (
        <NModal maskClosable={false} show={show}>
            <NCard style={{ width: '640px' }} role='dialog'>
                {{
                    headler: () => <modalHeader domain={domain} />,
                    default: () => <modalBody domain={domain} />,
                    action: () => <modalActions domain={domain} onUpdate:show={(v: boolean) => { emit("update:show", v) }} />
                }}
            </NCard>
        </NModal>
    )
}

export default DomainEditModal