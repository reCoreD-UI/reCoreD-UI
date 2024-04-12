import './RecordsView.css'

import {
    NSpin, NPageHeader,
    NFlex, NButton, NIcon, NGrid, NGi,
    NStatistic, NDataTable, NInput,
    NModalProvider,
    createDiscreteApi
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useRecordStore, type Record, type SOARecord, RecordTypes, type ARecord } from '@/stores/records'
import { getErrorInfo } from '@/apis/api'
import { PlusSquare, RedoAlt, CheckCircle, Clock, Cogs, Search } from '@vicons/fa'
import router from '@/router';
import RecordOps from '@/components/records/RecordOps'
import RecordEditModal from '@/components/records/RecordEditModal'
import i18n from '@/locale/i18n'
import { ref } from 'vue'

const { t } = i18n.global

type Props = {
    domain: string
}

const recordStore = useRecordStore()
const { notification } = createDiscreteApi(['notification'])
const editModalShow = ref(false)
const editingRecord = ref<Record>({} as Record)
const loading = ref(true);
const records = ref<Record[] | undefined>([] as Record[]);
const soa = ref<SOARecord>({} as SOARecord)
const reloadRecords = () => records.value = recordStore.records?.filter(e => e.record_type !== RecordTypes.RecordTypeSOA)

async function refreshRecords(domain: string) {
    try {
        await recordStore.loadRecords(domain)
        reloadRecords()
        soa.value = recordStore.records?.find(e => e.record_type === RecordTypes.RecordTypeSOA)?.content as SOARecord
    } catch (err) {
        const msg = getErrorInfo(err)
        notification.error(msg)
        console.error(err)
    } finally {
        loading.value = false;
    }
}

function goBack() {
    router.push('/domains')
}

function searchRecord(value: string) {
    if (value.length > 0) {
        records.value = recordStore.records?.
            filter(e => e.record_type !== RecordTypes.RecordTypeSOA).
            filter(e => !!~e.name.indexOf(value))
    } else {
        records.value = recordStore.records?.
            filter(e => e.record_type !== RecordTypes.RecordTypeSOA)
    }
}

async function deleteRecord(domain: string, record: Record) {
    try {
        await recordStore.removeRecord(domain, record)
        reloadRecords()
    } catch (err) {
        const msg = getErrorInfo(err)
        notification.error(msg)
        console.error(err)
    }
}

function showEditing(domain: string, record: Record) {
    editModalShow.value = true
    editingRecord.value = record
}

function newRecord(domain: string) {
    showEditing(domain, {
        zone: `${domain}.`,
        ttl: 500,
        record_type: RecordTypes.RecordTypeA,
        content: {
            ip: ''
        } as ARecord
    } as Record)
}

const generateColumns = (domain: string) => [
    {
        key: 'no',
        title: '#',
        render(_, index) {
            return index + 1
        }
    },
    {
        key: 'name',
        title: t("records.name"),
    },
    {
        key: 'record_type',
        title: t('records.recordType')
    },
    {
        key: 'content',
        title: t('records.content'),
        render(row: Record) {
            return Object.entries(row.content).map(i => i[1]).join(" ")
        }
    },
    {
        key: 'ttl',
        title: 'TTL (s)'
    },
    {
        key: '',
        render(row: Record) {
            return <RecordOps record={row} domain={domain} onRecord-delete={deleteRecord} onEdit-record={showEditing} />
        }
    }
] as DataTableColumns<Record>

const statRefresh = () => (
    <NGi>
        <NStatistic value={soa.value.refresh}>
            {{
                suffix: () => 's',
                label: () => (
                    <>
                        <NIcon component={RedoAlt} style={{ transform: 'translateY(2px)' }} />
                        <span>{t('records.refresh')}</span>
                    </>
                )
            }}
        </NStatistic>
    </NGi>
)

const statRetry = () => (
    <NGi>
        <NStatistic value={soa.value.retry}>
            {{
                suffix: () => 's',
                label: () => (
                    <>
                        <NIcon component={CheckCircle} style={{ transform: 'translateY(2px)' }} />
                        <span>{t('records.retry')}</span>
                    </>
                )
            }}
        </NStatistic>
    </NGi>
)

const statExpire = () => (
    <NGi>
        <NStatistic value={soa.value.expire}>
            {{
                suffix: () => 's',
                label: () => (
                    <>
                        <NIcon component={Clock} style={{ transform: 'translateY(2px)' }} />
                        <span>{t('records.expire')}</span>
                    </>
                )
            }}
        </NStatistic>
    </NGi>
)

const statTTL = () => (
    <NGi>
        <NStatistic value={soa.value.minttl}>
            {{
                suffix: () => 's',
                label: () => (
                    <>
                        <NIcon component={Cogs} style={{ transform: 'translateY(2px)' }} />
                        <span>{t('records.ttl')}</span>
                    </>
                )
            }}
        </NStatistic>
    </NGi>
)

function recordsViewBodyHeaderExtra() {
    return (
        <NGrid cols={4} >
            <statRefresh />
            <statRetry />
            <statExpire />
            <statTTL />
        </NGrid>
    )
}

function recordsViewBody({ domain }: Props) {
    const columns = generateColumns(domain)
    return (
        <NModalProvider>
            <NPageHeader title={t('domains.dnsRecord')} subtitle={domain} onBack={goBack}>
                {{
                    extra: () => (
                        <NFlex wrap={false} justify="end" inline>
                            <NButton type="primary" onClick={() => newRecord(domain)}>
                                {{
                                    icon: () => <NIcon component={PlusSquare} />,
                                    default: () => t('common.add')
                                }}
                            </NButton>
                            <NInput placeholder={t('records.search')} onUpdate:value={searchRecord} clearable>
                                {{
                                    prefix: () => <NIcon component={Search} />
                                }}
                            </NInput>
                        </NFlex>
                    ),
                    default: () => <recordsViewBodyHeaderExtra />
                }}
            </NPageHeader>
            <br />
            <NDataTable data={records.value} columns={columns} pagination={{ pageSize: 20 }} />
        </NModalProvider>
    )
}

function RecordsView({ domain }: Props) {
    try {
        refreshRecords(domain)
    } catch (err) {
        const msg = getErrorInfo(err)
        notification.error(msg)
        console.error(err)
    }
    return (
        <div id='records'>
            <RecordEditModal show={editModalShow.value} domain={domain} record={editingRecord.value} onReloadRecords={reloadRecords} />
            {
                loading.value ? <NSpin size='large' /> : <recordsViewBody domain={domain} />
            }
        </div>
    )
}

RecordsView.displayName = 'RecordsView'
export default RecordsView