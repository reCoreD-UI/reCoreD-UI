import { NButton, NButtonGroup, NTooltip, NIcon, NPopconfirm, NFlex } from 'naive-ui'
import { TrashAlt, EditRegular } from '@vicons/fa'
import type { Record } from '@/stores/records'
import i18n from '@/locale/i18n'
import type { SetupContext } from 'vue'
const { t } = i18n.global

type Props = {
    record: Record
    domain: string
}

type Events = {
    recordDelete(domain: string, record: Record): void
    editRecord(domain: string, record: Record): void
}

function RecordOps({ record, domain }: Props, { emit }: SetupContext<Events>) {
    return (
        <NFlex justify='end'>
            <NButtonGroup>
                <NTooltip>
                    {{
                        trigger: () => <NButton size='tiny' onClick={() => emit('editRecord', domain, record)}>
                            {{
                                icon: () => <NIcon component={EditRegular} />
                            }}
                        </NButton>,
                        default: () => t("common.edit")
                    }}
                </NTooltip>
                <NPopconfirm onPositiveClick={() => emit('recordDelete', domain, record)}>
                    {{
                        trigger: () => <NButton type='error' size='tiny'>
                            {{
                                icon: () => <NIcon component={TrashAlt} />
                            }}
                        </NButton>,
                        default: () => t("common.deleteConfirm")
                    }}
                </NPopconfirm>
            </NButtonGroup>
        </NFlex>
    )
}

export default RecordOps