<script setup lang="ts">
import { NSpin, NFlex, NCard, NButton, NIcon, useNotification, NModalProvider } from 'naive-ui'
import { PlusSquare } from "@vicons/fa"
import { onMounted, ref } from 'vue'
import { type Domain, useDomainStore } from '@/stores/domains'
import { getErrorInfo } from '@/apis/api'
import DomainInfo from '@/components/domains/DomainInfo.vue'
import DomainOps from '@/components/domains/DomainOps.vue'
import DomainRemoveModal from '@/components/domains/DomainRemoveModal.vue'
import DomainEditModal from '@/components/domains/DomainEditModal.vue'

const domainStore = useDomainStore()
const notification = useNotification()

const loading = ref(true);
const removeModalShow = ref(false);
const editModalShow = ref(false);
const operationDomain = ref({} as Domain)

onMounted(() => {
    try {
        domainStore.loadDomains()
        loading.value = false
    } catch (error) {
        const msg = getErrorInfo(error)
        notification.error(msg)
    }
})

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
</script>

<template>
    <div>
        <NSpin size="large" v-if="loading" />
        <NModalProvider v-else>
            <NFlex id="domains" vertical>
                <NCard v-for="domain in domainStore.domains" :title="domain.domain_name" v-bind:key="domain.id"
                    size="large" hoverable>
                    <DomainInfo :domain="domain" />
                    <template #action>
                        <DomainOps :domain="domain" @remove-domain="showRemoveModal" @edit-domain="showEditModal" />
                    </template>
                </NCard>
                <NCard hoverable>
                    <NButton block quaternary size="large" @click="addDomain">
                        <template #icon>
                            <NIcon :component="PlusSquare" :depth="5" />
                        </template>
                    </NButton>
                </NCard>
            </NFlex>
            <DomainRemoveModal v-model:show="removeModalShow" :domain="operationDomain" />
            <DomainEditModal v-model:show="editModalShow" :domain="operationDomain" />
        </NModalProvider>
    </div>
</template>

<style scoped>
.n-card {
    width: 32vw;
}
</style>