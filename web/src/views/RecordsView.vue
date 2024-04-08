<script setup lang="ts">
import { NSpin, NPageHeader, useNotification, NFlex, NButton, NIcon, NGrid, NGi, NStatistic, NDataTable, NInput } from 'naive-ui'
import { onMounted } from 'vue'
import { useRecordStore, type Record, type SOARecord, RecordTypes } from '@/stores/records'
import { getErrorInfo } from '@/apis/api'
import { PlusSquare, RedoAlt, CheckCircle, Clock, Cogs, Search } from '@vicons/fa'
import router from '@/router';

const props = defineProps<{
    domain: string
}>()
const loading = defineModel<boolean>('loading', { default: true });
const records = defineModel<Record[]>('records');
const search = defineModel<string>('search', { default: '' })
const soa = defineModel<SOARecord | undefined>('soa')

const recordStore = useRecordStore()
const notification = useNotification()
onMounted(() => {
    try {
        refreshRecords()
    } catch (err) {
        const msg = getErrorInfo(err)
        notification.error(msg)
    }
})

function refreshRecords() {
    recordStore.loadRecords(props.domain)
    records.value = recordStore.records
    soa.value = records.value?.find(e => e.record_type === RecordTypes.RecordTypeSOA)?.content as SOARecord
    loading.value = false;
}

function goBack() {
    router.push('/domains')
}
</script>

<template>
    <div id="records">
        <NSpin size="large" v-if="loading" />
        <NPageHeader v-else title="DNS 记录" :subtitle="domain" @back="goBack">
            <template #extra>
                <NFlex :wrap="false" justify="end" inline>
                    <NButton type="primary">
                        <template #icon>
                            <NIcon>
                                <PlusSquare />
                            </NIcon>
                        </template>
                        新增
                    </NButton>
                    <NInput v-model:value="search" placeholder="搜索...">
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
                            刷新时间
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
                            重试间隔
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
                            超期时间
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
                            缓存时间
                        </template>
                    </NStatistic>
                </NGi>
            </NGrid>
        </NPageHeader>
        <NDataTable :data="records">

        </NDataTable>
    </div>
</template>

<style scoped>
.icon {
    transform: translateY(2px);
}
</style>