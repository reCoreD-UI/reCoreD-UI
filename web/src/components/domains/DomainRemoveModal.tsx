import './DomainRemoveModal.css'

import { useDomainStore, type Domain } from '@/stores/domains';
import { NModal, NCard, NFlex, NButton, NIcon, NInput, createDiscreteApi } from 'naive-ui'
import { Times, TrashAlt, QuestionCircle } from '@vicons/fa';
import { getErrorInfo } from '@/apis/api';
import i18n from '@/locale/i18n';
import { ref, type EmitsOptions, type ObjectEmitsOptions, type SetupContext } from 'vue';

const t = i18n.global.t
const domainStore = useDomainStore()
const { notification } = createDiscreteApi(['notification'])

type Props = {
    domain: Domain
    show: boolean
}

type Events = {
    'update:show': (value: boolean) => void
}

const domain_name = ref('')
const loading = ref(false)

async function confirm(domain: Domain) {
    domain_name.value = ''
    loading.value = true

    try {
        if (domain)
            await domainStore.removeDomain(domain)
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
        console.error(e)
    } finally {
        loading.value = false
    }
}

function modalBody({ domain }: Props) {
    return (
        <>
            <p>{t('common.deleteConfirm')}</p>
            <p>{t('domains.deleteHint')}</p>
            <p>{t('domains.confirm1')} <b id="boldit">{domain.domain_name}</b> {t('domains.confirm2')}</p>
            <br />
            <p>
                <NInput onUpdate:value={(v) => domain_name.value = v} placeholder={domain.domain_name} />
            </p>
        </>
    )
}

function modalActions({ domain }: Props, { emit }: SetupContext<Events>) {
    return <>
        <NFlex justify='end'>
            <NButton size='small' onClick={() => { emit('update:show', false) }}>
                {{
                    icon: () => <NIcon><Times /></NIcon>,
                    default: () => t('common.cancel')
                }}
            </NButton>

            <NButton size='small' type='error' disabled={domain_name.value !== domain.domain_name} attrType='submit' loading={loading.value} onClick={() => confirm(domain).then(() => emit('update:show', false))}>
                {{
                    icon: () => <NIcon><TrashAlt /></NIcon>,
                    default: () => t('common.confirm')
                }}
            </NButton>
        </NFlex>
    </>
}

function DomainRemoveModal({ domain, show }: Props, { emit }: SetupContext<Events>) {
    return (
        <NModal maskClosable={false} show={show}>
            <NCard role='dialog' style={{ width: '600px' }}>
                {{
                    header: () => <><NIcon class="icon-down" color='red' />{t('domains.delete')} - {domain.domain_name}</>,
                    default: () => <modalBody domain={domain} />,
                    action: () => <modalActions domain={domain} onUpdate:show={(v: boolean) => emit('update:show', v)} />
                }}
            </NCard>
        </NModal>
    )
}

export default DomainRemoveModal