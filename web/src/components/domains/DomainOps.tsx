import { NSpace, NButton, NIcon, NTooltip, NFlex } from 'naive-ui'
import { TrashAlt, EditRegular, Book } from '@vicons/fa'
import { type Domain } from "../../stores/domains"
import router from '@/router';
import i18n from '@/locale/i18n'
import type { SetupContext } from 'vue';
const t = i18n.global.t

type Props = {
    domain: Domain
}

type Events = {
    removeDomain(domain: Domain): void
    editDomain(domain: Domain): void
}

function loadRecord({ domain }: Props) {
    return (
        <NTooltip trigger="hover">
            {{
                trigger: () =>
                    <NButton size="tiny" type="primary" onClick={() => { router.push(`/records/${domain.domain_name}`) }}>
                        {{ icon: () => <NIcon component={Book} /> }}
                    </NButton>,
                default: () => t('domains.dnsRecord')
            }}
        </NTooltip>
    )
}

function editDomain({ domain }: Props, { emit }: SetupContext<Events>) {
    return (
        <NTooltip trigger="hover">
            {{
                default: () => t('common.edit'),
                trigger: () =>
                    <NButton size="tiny" onClick={() => emit("editDomain", domain)}>
                        {{
                            icon: () =>
                                <NIcon component={EditRegular} />
                        }}
                    </NButton>
            }}

        </NTooltip>
    )
}

function deleteDomain({ domain }: Props, { emit }: SetupContext<Events>) {
    return (
        <NTooltip trigger="hover">
            {{
                default: () => t('common.delete'),
                trigger: () =>
                    <NButton type="error" size="tiny" onClick={() => emit("removeDomain", domain)}>
                        {{
                            icon: () =>
                                <NIcon component={TrashAlt} />
                        }}
                    </NButton>
            }}
        </NTooltip>
    )
}

function DomainOps({ domain }: Props, { emit }: SetupContext<Events>) {
    return (
        <div>
            <NFlex justify='end'>
                <loadRecord domain={domain} />
                <editDomain domain={domain} onEditDomain={(d: Domain) => emit("editDomain", d)} />
                <deleteDomain domain={domain} onRemoveDomain={(d: Domain) => emit("removeDomain", d)} />
            </NFlex>
        </div>
    )
}

export default DomainOps