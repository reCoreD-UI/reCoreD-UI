import './DomainsView.css'

import { NSpin, NFlex, NCard, NButton, NIcon, NModalProvider, createDiscreteApi } from 'naive-ui'
import { PlusSquare } from "@vicons/fa"
import { type Domain, useDomainStore } from '@/stores/domains'
import { getErrorInfo } from '@/apis/api'
import DomainInfo from '@/components/domains/DomainInfo'
import DomainOps from '@/components/domains/DomainOps'
import DomainRemoveModal from '@/components/domains/DomainRemoveModal'
import DomainEditModal from '@/components/domains/DomainEditModal'
import { ref } from 'vue'

const domainStore = useDomainStore()
const { notification } = createDiscreteApi(['notification'])

const loading = ref(true);
const removeModalShow = ref(false);
const editModalShow = ref(false);
const operationDomain = ref({} as Domain)

function showRemoveModal(domain: Domain) {
    operationDomain.value = domain
    removeModalShow.value = true
}

function showEditModal(domain: Domain) {
    operationDomain.value = domain
    editModalShow.value = true
}

function addDomain() {
    const domain = {
        refresh_interval: 86400,
        retry_interval: 7200,
        expiry_period: 3600000,
        negative_ttl: 86400,
        serial_number: 1,
    } as Domain
    showEditModal(domain)
}

function DomainsView() {
    try {
        domainStore.loadDomains()
        loading.value = false
    } catch (e) {
        const msg = getErrorInfo(e)
        notification.error(msg)
        console.error(e)
    }
    return (
        <>
            {
                loading.value ? <NSpin size="large" /> :
                    <NModalProvider>
                        <NFlex vertical>
                            {
                                domainStore.domains.map((domain: Domain) => (
                                    <NCard title={domain.domain_name} key={domain.id} size='large' hoverable>
                                        {{
                                            default: () => <DomainInfo domain={domain} />,
                                            action: () => <DomainOps domain={domain} onRemoveDomain={showRemoveModal} onEditDomain={showEditModal} />
                                        }}

                                    </NCard>
                                ))
                            }

                            <NCard hoverable>
                                <NButton block quaternary size="large" onClick={addDomain}>
                                    {{
                                        icon: () => <NIcon component={PlusSquare} depth={5} />
                                    }}
                                </NButton>
                            </NCard>
                        </NFlex>
                        <DomainRemoveModal show={removeModalShow.value} domain={operationDomain.value} onUpdate:show={(v: boolean) => removeModalShow.value = v} />
                        <DomainEditModal show={editModalShow.value} domain={operationDomain.value} onUpdate:show={(v: boolean) => editModalShow.value = v} />
                    </NModalProvider>
            }
        </>
    )
}

DomainsView.displayName = 'DomainsView'

export default DomainsView