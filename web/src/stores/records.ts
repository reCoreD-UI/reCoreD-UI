import { useState } from 'react'
import i18n from '../locale'
import api from '../api';
const { t } = i18n
export class ARecord {
    ip?: string

    static validate(v: ARecord): true | Error {
        if (!v.ip || v.ip === '') return new Error(t('common.mandatory'))
        if (!/^((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/.test(v.ip)) return new Error(t('records.errors.badIPv4'))
        return true
    }

    toString(): string | undefined {
        return this.ip
    }
}

export class AAAARecord {
    ip?: string

    static validate(v: AAAARecord): true | Error {
        if (!v.ip || v.ip === '') return new Error(t('common.mandatory'))
        if (!/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(v.ip)) return new Error(t('records.errors.badIPv4'))
        return true
    }

    toString(): string | undefined {
        return this.ip
    }
}

export class TXTRecord {
    text?: string

    static validate(v: TXTRecord): true | Error {
        if (!v.text || v.text === '') return new Error(t('common.mandatory'))
        return true
    }

    toString(): string | undefined {
        return this.text
    }
}

export class CNAMERecord {
    host?: string

    static validate(v: CNAMERecord): true | Error {
        if (!v.host || v.host === '') return new Error(t('common.mandatory'))
        if (v.host.includes(' ')) return new Error(t('records.errors.hasSpace'))
        if (!v.host.endsWith('.')) return new Error(t('records.errors.endWithDot'))
        return true
    }

    toString(): string | undefined {
        return this.host
    }
}

export class NSRecord {
    host?: string

    static validate(v: NSRecord): true | Error {
        if (!v.host || v.host === '') return new Error(t('common.mandatory'))
        if (v.host.includes(' ')) return new Error(t('records.errors.hasSpace'))
        if (!v.host.endsWith('.')) return new Error(t('records.errors.endWithDot'))
        return true
    }

    toString(): string | undefined {
        return this.host
    }
}

export class MXRecord {
    host?: string
    preference?: number

    static validate(v: MXRecord): true | Error {
        if (!v.host || v.host === '' || !v.preference) return new Error(t('common.mandatory'))
        if (v.host.includes(' ')) return new Error(t('records.errors.hasSpace'))
        if (!v.host.endsWith('.')) return new Error(t('records.errors.endWithDot'))
        return true
    }

    toString(): string | undefined {
        return Object.entries(this).map(i => i[1]).join(" ")
    }
}

export class SRVRecord {
    priority?: number;
    weight?: number;
    port?: number;
    target?: string;

    static validate(v: SRVRecord): true | Error {
        if (!v.port || !v.priority || !v.weight || !v.target || v.target === '') return new Error(t('common.mandatory'))
        if (v.target?.includes(' ')) return new Error(t('records.errors.hasSpace'))
        if (!v.target?.endsWith('.')) return new Error(t('records.errors.endWithDot'))
        return true
    }

    toString(): string | undefined {
        return Object.entries(this).map(i => i[1]).join(" ")
    }
}

export class SOARecord {
    ns?: string;
    MBox?: string;
    refresh?: number;
    retry?: number;
    expire?: number;
    minttl?: number;

    static validate(v: SOARecord): true | Error {
        if (!v.refresh || !v.retry || !v.expire! || !v.minttl || !v.MBox || v.MBox === '' || !v.ns || v.ns === '') return new Error(t('common.mandatory'))
        if (v.ns?.includes(' ') || v.MBox?.includes(' ')) return new Error(t('records.errors.hasSpace'))
        if (!v.ns?.endsWith('.') || !v.MBox?.endsWith('.')) return new Error(t('records.errors.endWithDot'))
        if (v.MBox?.includes('@')) return new Error(t('records.errors.badEmail'))
        return true
    }

    toString(): string | undefined {
        return Object.entries(this).map(i => i[1]).join(" ")
    }
}

export class CAARecord {
    flag?: number
    tag?: string
    value?: string

    static validate(v: CAARecord): true | Error {
        if (!v.flag || !v.tag || v.tag === '' || !v.value || v.value === '') return new Error(t('common.mandatory'))
        if (v.tag?.includes(' ')) return new Error(t('records.errors.hasSpace'))
        return true
    }

    toString(): string | undefined {
        return Object.entries(this).map(i => i[1]).join(" ")
    }
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

export class Record<T = RecordT> {
    id?: number
    zone?: string
    name?: string
    ttl?: number
    content?: T
    record_type?: RecordTypes

    validate(): true | Error {
        const zone = Record.validateZone(this.zone!)
        if (zone !== true) return zone
        const name = Record.validateName(this.name!)
        if (name !== true) return name
        return true
    }

    static validateZone(zone: string): true | Error {
        if (zone === '') return new Error(t('common.mandatory'))
        if (zone.includes(' ')) new Error(t('records.errors.hasSpace'))
        if (zone.endsWith('.')) return new Error(t('records.errors.endWithDot'))
        return true
    }

    static validateName(name: string): true | Error {
        if (name === '') return new Error(t('common.mandatory'))
        if (name.includes(' ')) return new Error(t('records.errors.hasSpace'))
        if (name.startsWith('.') || name.endsWith('.')) return new Error(t('records.errors.badName.dotAndMinus'))
        if (name.startsWith('-') || name.endsWith('.')) return new Error(t('records.errors.badName.dotAndMinus'))
        if (name.includes('..')) new Error(t('records.errors.badName.doubleDots'))
        if (name.split('.').filter(e => e.length > 63).length > 0) return new Error(t('records.errors.badName.longerThan63'))
        return true
    }
}

const recordDevData = new Map<string, Record[]>([
    ['example.com', [
        {
            id: 1,
            zone: "example.com",
            name: "@",
            ttl: 3600,
            record_type: RecordTypes.RecordTypeSOA,
            content: {
                ns: "ns1.example.com.",
                MBox: "admin@example.com.",
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
                host: "ns1.example.com."
            }
        },
        {
            id: 3,
            zone: "example.com",
            name: "@",
            ttl: 3600,
            record_type: RecordTypes.RecordTypeNS,
            content: {
                host: "ns2.example.com."
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
                host: "www.example.com."
            }
        }
    ] as Record[]],
    ['example.org', [
        {
            id: 1,
            zone: "example.org",
            name: "@",
            ttl: 3600,
            record_type: RecordTypes.RecordTypeSOA,
            content: {
                ns: "ns1.example.org.",
                MBox: "admin@example.org.",
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
                host: "ns1.example.org."
            }
        },
        {
            id: 3,
            zone: "example.org",
            name: "@",
            ttl: 3600,
            record_type: RecordTypes.RecordTypeNS,
            content: {
                host: "ns2.example.org."
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
                host: "www.example.org."
            }
        }
    ] as Record[]]
])

export const useRecordStore = () => {
    const [records, setRecords] = useState<Record[]>([])

    async function loadRecords(domain: string) {
        // TODO: load from api
        setRecords(import.meta.env.DEV ?
            recordDevData.get(domain)! :
            (await api.get<Record[]>(`/records/${domain}`)).data.data)
    }

    async function addRecord(domain: string, record: Record) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            record = (await api.post(`/records/${domain}`, record)).data.data
        }

        setRecords(records.concat(record))
    }

    async function updateRecord(domain: string, record: Record) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            await api.put(`/records/${domain}`, record)
        }

        setRecords(records.map(e => e.id === record.id ? record : e))
    }

    async function removeRecord(domain: string, record: Record) {
        // TODO: load from api
        if (!import.meta.env.DEV) {
            await api.delete(`/records/${domain}/${record.id}`)
        }

        setRecords(records.filter(e => e.id !== record.id))
    }

    return { records, loadRecords, addRecord, updateRecord, removeRecord }
}