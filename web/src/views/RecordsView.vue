<script setup lang="tsx">
import {
    NSpin, NPageHeader, useNotification,
    NFlex, NButton, NIcon, NGrid, NGi,
    NStatistic, NDataTable, NInput,
    NModalProvider
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRecordStore, type Record, type SOARecord, RecordTypes } from '@/stores/records'
import { getErrorInfo } from '@/apis/api'
import { PlusSquare, RedoAlt, CheckCircle, Clock, Cogs, Search } from '@vicons/fa'
import router from '@/router';
import RecordOps from '@/components/records/RecordOps.vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const props = defineProps<{
    domain: string
}>()

const columns = [
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
            return <RecordOps record={row} domain={props.domain} onRecord-delete={deleteRecord} />
        }
    }
] as DataTableColumns<Record>

const recordStore = useRecordStore()
const notification = useNotification()

const records = ref<Record[] | undefined>([]);
const soa = ref<SOARecord>({} as SOARecord)
const loading = ref(true);
onMounted(() => {
    try {
        refreshRecords()
    } catch (err) {
        const msg = getErrorInfo(err)
        notification.error(msg)
        console.error(err)
    }
})

async function refreshRecords() {
    try {
        await recordStore.loadRecords(props.domain)
        records.value = recordStore.records?.filter(e => e.record_type !== RecordTypes.RecordTypeSOA)
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
        records.value = recordStore.records?.filter(e => e.record_type !== RecordTypes.RecordTypeSOA)
    } catch (err) {
        const msg = getErrorInfo(err)
        notification.error(msg)
        console.error(err)
    }
}
</script>

<template>
    <div id="records">
        <NSpin size="large" v-if="loading" />
        <div v-else class="content">
            <NModalProvider>
                <NPageHeader :title="t('domains.dnsRecord')" :subtitle="domain" @back="goBack">
                    <template #extra>
                        <NFlex :wrap="false" justify="end" inline>
                            <NButton type="primary">
                                <template #icon>
                                    <NIcon>
                                        <PlusSquare />
                                    </NIcon>
                                </template>
                                {{ t('common.add') }}
                            </NButton>
                            <NInput :placeholder="t('records.search')" @update:value="searchRecord" clearable>
                                <template #prefix>
                                    <NIcon :component="Search" />
                                </template>
                            </NInput>
                        </NFlex>
                    </template>
                    <NGrid :cols="4">
                        <NGi>
                            <NStatistic :value="soa?.refresh">
                                <template #suffix>
                                    s
                                </template>
                                <template #label>
                                    <NIcon class="icon">
                                        <RedoAlt />
                                    </NIcon>
                                    {{ t('records.refresh') }}
                                </template>
                            </NStatistic>
                        </NGi>
                        <NGi>
                            <NStatistic :value="soa?.retry">
                                <template #suffix>
                                    s
                                </template>
                                <template #label>
                                    <NIcon class="icon">
                                        <CheckCircle />
                                    </NIcon>
                                    {{ t('records.retry') }}
                                </template>
                            </NStatistic>
                        </NGi>
                        <NGi>
                            <NStatistic :value="soa?.expire">
                                <template #suffix>
                                    s
                                </template>
                                <template #label>
                                    <NIcon class="icon">
                                        <Clock />
                                    </NIcon>
                                    {{ t('records.expire') }}
                                </template>
                            </NStatistic>
                        </NGi>
                        <NGi>
                            <NStatistic :value="soa?.minttl">
                                <template #suffix>
                                    s
                                </template>
                                <template #label>
                                    <NIcon class="icon">
                                        <Cogs />
                                    </NIcon>
                                    {{ t('records.ttl') }}
                                </template>
                            </NStatistic>
                        </NGi>
                    </NGrid>
                </NPageHeader>
                <br />
                <NDataTable :data="records" :columns="columns" :pagination="{ pageSize: 20 }" />
            </NModalProvider>
        </div>
    </div>
</template>

<style scoped>
.icon {
    transform: translateY(2px);
}

div#records {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    padding: 1.5rem;
}
</style>
