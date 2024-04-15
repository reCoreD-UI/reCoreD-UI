import './DomainsView.css'
import { Domain, useDomainStore } from '../stores/domains'
import { useEffect, useState } from 'react'
import { App, Button, Card, Space, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom'
import DomainDeleteModal from '../components/domains/DomainDeleteModal'
import DomainCard from '../components/domains/DomainCard'
import DomainEditModal from '../components/domains/DomainEditModal'
import { ResponseError, getErrorInfo } from '../api'

const emptyDomain: Domain = { domain_name: '' }

export default function DomainsView() {
    const [loading, setLoading] = useState(true)
    const [deleteModalShow, setDeleteModalShow] = useState(false)
    const [editModalShow, setEditModalShow] = useState(false)
    const [currentDomain, setCurrentDomain] = useState(emptyDomain)
    const { notification } = App.useApp()
    const domainStore = useDomainStore()
    const go = useNavigate()

    function openDeleteModal(domain: Domain) {
        setCurrentDomain(domain)
        setDeleteModalShow(true)
    }

    function closeDeleteModdal() {
        setDeleteModalShow(false)
    }

    function openEditModal(domain: Domain) {
        setCurrentDomain(domain)
        setEditModalShow(true)
    }

    function closeEditModal() {
        setEditModalShow(false)
    }

    function newDomain() {
        openEditModal({
            domain_name: '',
            admin_email: '',
            main_dns: '',
            refresh_interval: 86400,
            retry_interval: 7200,
            expiry_period: 3600000,
            negative_ttl: 86400,
            serial_number: 1,
        })
    }

    // called once only.
    useEffect(() => {
        domainStore.loadDomains().then(() => setLoading(false)).catch(e => {
            const msg = getErrorInfo(e as ResponseError)
            notification.error(msg)
            console.error(e)
        })
    }, [])

    return (
        <>
            {
                loading ? <Spin size='large' /> :
                    <>
                        <Space direction="vertical" >
                            {
                                domainStore.domains.map(e => (
                                    <DomainCard domain={e}
                                        onDeleteClick={() => openDeleteModal(e)}
                                        onRecordClick={() => go(`/records/${e.domain_name}`)}
                                        onEditClick={() => openEditModal(e)}
                                        key={e.id}
                                    />
                                ))
                            }
                            <Card>
                                <Button icon={<PlusOutlined className='icon' />}
                                    block type="text" onClick={newDomain} />
                            </Card>
                        </Space>
                        <DomainDeleteModal open={deleteModalShow}
                            onCancel={closeDeleteModdal}
                            onOk={closeDeleteModdal}
                            domain={currentDomain}
                            removeDomain={domainStore.removeDomain}
                        />
                        <DomainEditModal open={editModalShow}
                            onCancel={closeEditModal}
                            onOk={closeEditModal}
                            domain={currentDomain}
                            editDomain={domainStore.updateDomain}
                            createDomain={domainStore.addDomain}
                        />
                    </>
            }
        </>
    )
}