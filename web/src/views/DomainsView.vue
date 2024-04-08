<script setup lang="ts">
import { NSpin, NFlex, NCard, NButton, NIcon, useNotification } from 'naive-ui'
import { PlusSquare } from "@vicons/fa"
import { onMounted } from 'vue'
import { useDomainStore } from '@/stores/domains'
import { getErrorInfo } from '@/apis/api'
import DomainInfo from '@/components/domains/DomainInfo.vue'
import DomainOps from '@/components/domains/DomainOps.vue'

const loading = defineModel<boolean>({ default: true });
const domainStore = useDomainStore()
const notification = useNotification()

onMounted(() => {
    try {
        domainStore.loadDomains()
        loading.value = false
    } catch (error) {
        const msg = getErrorInfo(error)
        notification.error(msg)
    }
})
</script>

<template>
    <div>
        <NSpin size="large" v-if="loading" />
        <NFlex v-else id="domains" vertical>
            <NCard v-for="domain in domainStore.domains" :title="domain.domain_name" v-bind:key="domain.id" size="large"
                hoverable>
                <DomainInfo :domain="domain" />
                <template #action>
                    <DomainOps :domain="domain" />
                </template>
            </NCard>
            <NCard hoverable>
                <NButton block quaternary size="large">
                    <template #icon>
                        <NIcon :component="PlusSquare" :depth="5" />
                    </template>
                </NButton>
            </NCard>
        </NFlex>
    </div>
</template>

<style scoped>
.n-card {
    width: 32vw;
}
</style>