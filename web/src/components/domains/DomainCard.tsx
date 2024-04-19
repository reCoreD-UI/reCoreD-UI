import { Card, Tooltip } from "antd"
import { Domain } from "../../stores/domains"
import { BookOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"
import DomainInfo from "./DomainInfo"
import i18n from '../../locale'
const { t } = i18n

type DomainCardProps = {
    domain: Domain
    onRecordClick(): void
    onEditClick(): void
    onDeleteClick(): void
}

export default function DomainCard({ domain, onRecordClick, onEditClick, onDeleteClick }: DomainCardProps) {
    return (
        <Card className='domain-info' title={domain.domain_name} actions={[
            <Tooltip title={t('domains.dnsRecord')}>
                <BookOutlined key='records' className='icon' onClick={onRecordClick} />
            </Tooltip>,
            <Tooltip title={t('common.edit')} >
                <EditOutlined key='edit' className='icon' onClick={onEditClick} />
            </Tooltip>,
            <Tooltip title={t('common.delete')}>
                <DeleteOutlined key='delete' className='icon' onClick={onDeleteClick} />
            </Tooltip>
        ]} key={domain.id}>
            <DomainInfo domain={domain} />
        </Card>
    )
}

