import { useState } from 'react'
import api from '../api'

export class Domain {
    id?: number
    domain_name?: string
    main_dns?: string
    admin_email?: string
    serial_number?: number
    refresh_interval?: number
    retry_interval?: number
    expiry_period?: number
    negative_ttl?: number
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
    },
]

export const useDomainStore = () => {
    const [domains, setDomains] = useState<Domain[]>([])

    async function loadDomains() {
        setDomains(import.meta.env.DEV ? domainDevData : (await api.get<Domain[]>('/domains')).data.data)
    }

    async function addDomain(domain: Domain) {
        if (!import.meta.env.DEV) {
            domain = (await api.post("/domains", domain)).data.data
        } else if (!domain.id) {
            domain.id = Math.floor(1000 + Math.random() * 9000)
        }

        setDomains(domains.concat(domain))
    }

    async function updateDomain(domain: Domain) {
        if (!import.meta.env.DEV) {
            await api.put("/domains", domain)
        }

        setDomains(domains.map((e: Domain) => (e.id === domain.id || e.domain_name === domain.domain_name) ? domain : e))
    }

    async function removeDomain(domain: Domain) {
        if (!import.meta.env.DEV) {
            await api.delete(`/domains/${domain.id}`)
        }
        setDomains(domains.filter(e => e.id !== domain.id))
    }

    return { domains, loadDomains, addDomain, updateDomain, removeDomain }
}