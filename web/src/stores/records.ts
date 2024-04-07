import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ARecord = {
    ip: string;
}

export type AAAARecord = {
    ip: string;
}

export type TXTRecord = {
    text: string;
}

export type CNAMERecord = {
    host: string;
}

export type NSRecord = {
    host: string;
}

export type MXRecord = {
    host: string;
    preference: number;
}

export type SRVRecord = {
    priority: number;
    weight: number;
    port: number;
    target: string;
}

export type SOARecord = {
    ns: string;
    MBox: string;
    refresh: number;
    retry: number;
    expire: number;
    minttl: number;
}

export type CAARecord = {
    flag: number;
    tag: string;
    value: string;
}

export enum RecordTypes {
    RecordTypeA = "A",
    RecordTypeAAAA = "AAAA",
    RecordTypeCNAME = "CNAME",
    RecordTypeSOA = "SOA",
    RecordTypeTXT = "TXT",
    RecordTypeNS = "NS",
    RecordTypeMX = "MX",
    RecordTypeCAA = "CAA",
    RecordTypeSRV = "SRV"
}

export type RecordT = ARecord | AAAARecord | TXTRecord | CNAMERecord | NSRecord | MXRecord | SRVRecord | SOARecord | CAARecord

export type Record = {
    id: number;
    zone: string;
    name: string;
    ttl: number;
    content: RecordT;
    record_type: RecordTypes;
}

const recordDevData = new Map<string, Record[]>([
    [
        'example.com', [
            {
                id: 1,
                zone: "example.com",
                name: "@",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeSOA,
                content: {
                    ns: "ns1.example.com",
                    MBox: "admin@example.com",
                    refresh: 86400,
                    retry: 7200,
                    expire: 3600000,
                    minttl: 86400,
                }
            },
            {
                id: 2,
                zone: "example.com",
                name: "@",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeNS,
                content: {
                    host: "ns1.example.com"
                }
            },
            {
                id: 3,
                zone: "example.com",
                name: "@",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeNS,
                content: {
                    host: "ns2.example.com"
                }
            },
            {
                id: 4,
                zone: "example.com",
                name: "www",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeA,
                content: {
                    ip: "233.233.233.233"
                }
            },
            {
                id: 5,
                zone: "example.com",
                name: "cname",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeCNAME,
                content: {
                    host: "www.example.com"
                }
            }
        ]
    ],
    [
        'example.org', [
            {
                id: 1,
                zone: "example.org",
                name: "@",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeSOA,
                content: {
                    ns: "ns1.example.org",
                    MBox: "admin@example.org",
                    refresh: 86400,
                    retry: 7200,
                    expire: 3600000,
                    minttl: 86400,
                }
            },
            {
                id: 2,
                zone: "example.org",
                name: "@",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeNS,
                content: {
                    host: "ns1.example.org"
                }
            },
            {
                id: 3,
                zone: "example.org",
                name: "@",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeNS,
                content: {
                    host: "ns2.example.org"
                }
            },
            {
                id: 4,
                zone: "example.org",
                name: "www",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeA,
                content: {
                    ip: "233.233.233.233"
                }
            },
            {
                id: 5,
                zone: "example.org",
                name: "cname",
                ttl: 3600,
                record_type: RecordTypes.RecordTypeCNAME,
                content: {
                    host: "www.example.org"
                }
            }
        ]
    ]
])


export const useRecordStore = defineStore('records', () => {
    const records = ref<Record[] | undefined>([])
    const recordsGetter = computed(() => records.value)

    function loadRecords(domain: string) {
        // TODO: load from api
        records.value = import.meta.env.DEV ? recordDevData.get(domain) : []
    }

    function addRecord(domain: string, record: Record) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            //record = 
        }

        records.value?.push(record)
    }

    function updateRecord(domain: string, record: Record) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            //record = 
        }

        records.value = records.value?.map(e => e.id === record.id ? record : e)
    }

    function removeRecord(domain: string, record: Record) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            //record = 
        }

        records.value = records.value?.filter(e => e.id !== record.id)
    }

    return { records, recordsGetter, loadRecords }
})
