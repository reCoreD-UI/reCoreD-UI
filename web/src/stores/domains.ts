import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/apis/api'

export type Domain = {
    id: number;
    domain_name: string;
    main_dns: string;
    admin_email: string;
    serial_number: number;
    refresh_interval: number;
    retry_interval: number;
    expiry_period: number;
    negative_ttl: number;
}

const domainDevData: Domain[] = [
    {
        id: 1,
        domain_name: "example.com",
        main_dns: "ns1.example.com",
        admin_email: "admin@example.com",
        serial_number: 114514,
        refresh_interval: 86400,
        retry_interval: 7200,
        expiry_period: 3600000,
        negative_ttl: 86400
    },
    {
        id: 2,
        domain_name: "example.org",
        main_dns: "ns1.example.org",
        admin_email: "admin@example.org",
        serial_number: 1919810,
        refresh_interval: 86400,
        retry_interval: 7200,
        expiry_period: 3600000,
        negative_ttl: 86400
    }
]

export const useDomainStore = defineStore('domains', () => {
    const domains = ref<Domain[]>([])
    const domainsGetter = computed(() => domains.value)

    async function loadDomains() {
        // TODO: load from api
        domains.value = import.meta.env.DEV ?
            domainDevData :
            (await api.get<Domain[]>('/domains')).data.data
    }

    async function addDomain(domain: Domain) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            domain = (await api.post("/domains", domain)).data.data
        }

        domains.value.push(domain)
    }

    async function updateDomain(domain: Domain) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            await api.put("/domains", domain)
        }

        domains.value = domains.value.map(e => e.id === domain.id ? domain : e)
    }

    async function removeDomain(domain: Domain) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            await api.delete(`/domains/${domain.id}`)
        }

        domains.value = domains.value.filter(e => e.id !== domain.id)
    }
    return { domains, domainsGetter, loadDomains, addDomain, updateDomain, removeDomain }
})

