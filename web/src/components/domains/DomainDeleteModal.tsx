import { App, Input, Modal } from "antd"
import { Domain } from "../../stores/domains"
import { useState } from "react"
import i18n from '../../locale'
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons"
import { ResponseError, getErrorInfo } from "../../api"
const { t } = i18n

type Props = {
    open: boolean
    domain: Domain
    removeDomain(domain: Domain): Promise<void>
    onOk(): void
    onCancel(): void
}

export default function DomainDeleteModal({ open, domain, removeDomain, onOk, onCancel }: Props) {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const { notification } = App.useApp()

    function confirm() {
        setLoading(true)
        removeDomain(domain).then(onOk).finally(() => setLoading(false)).catch(e => {
            const msg = getErrorInfo(e as ResponseError)
            notification.error(msg)
            console.error(e)
        })
    }

    return (
        <Modal onOk={confirm} onCancel={onCancel}
            title={`${t('domains.delete')} - ${domain.domain_name}`}
            confirmLoading={loading}
            okButtonProps={{
                disabled: input !== domain.domain_name,
                icon: <DeleteOutlined />,
                danger: true
            }}
            cancelButtonProps={{
                icon: <CloseOutlined />
            }}
            open={open}
            closeIcon={false}
            maskClosable={false}

            centered
            destroyOnClose
        >
            <p>{t('common.deleteConfirm')}</p>
            <p>{t('domains.deleteHint')}</p>
            <p>{t('domains.confirm1')} <b id="boldit">{domain.domain_name}</b> {t('domains.confirm2')}</p>
            <p />
            <p>
                <Input placeholder={domain.domain_name} onChange={e => setInput(e.target.value)} />
            </p>
        </Modal>
    )
}