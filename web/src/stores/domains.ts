import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

    function loadDomains() {
        // TODO: load from api
        domains.value = import.meta.env.DEV ? domainDevData : []
    }

    function addDomain(domain: Domain) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            //domain = 
        }

        domains.value.push(domain)
    }

    function updateDomain(domain: Domain) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            //domain = 
        }

        domains.value = domains.value.map(e => e.id === domain.id ? domain : e)
    }

    function removeDomain(domain: Domain) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            //domain = 
        }

        domains.value = domains.value.filter(e => e.id !== domain.id)
    }
    return { domains, domainsGetter, loadDomains, addDomain, updateDomain, removeDomain }
})

