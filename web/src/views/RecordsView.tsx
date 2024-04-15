import { LeftOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { App, Button, Flex, Input, Layout, Spin, Table, Typography, theme } from "antd"
import { Params, useLoaderData, useNavigate } from "react-router-dom"
import './RecordsView.css'
import i18n from '../locale'
import { useEffect, useState } from "react"
import { type Record, RecordT, useRecordStore, RecordTypes } from "../stores/records"
import { ResponseError, getErrorInfo } from "../api"
import RecordOps from "../components/records/RecordOps"
import RecordEditModal from "../components/records/RecordEditModal"

const { t } = i18n
const emptyRecord: Record<RecordT> = {} as Record

export default function RecordsView() {
    const { domain } = useLoaderData() as Params<string>
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState<string>('')
    const [editModalShow, setEditModalShow] = useState(false)
    const [currentRecord, setCurrentRecord] = useState<Record>(emptyRecord)
    const { notification } = App.useApp()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const go = useNavigate()
    const recordStore = useRecordStore()

    useEffect(() => {
        if (domain)
            recordStore.loadRecords(domain).then(() => setLoading(false)).catch(e => {
                const msg = getErrorInfo(e as ResponseError)
                notification.error(msg)
                console.error(e)
            })
    }, [domain])

    function closeEditModal() {
        setCurrentRecord(emptyRecord)
        setEditModalShow(false)
    }

    function openEditModal(record: Record) {
        setCurrentRecord(record)
        setEditModalShow(true)
    }

    function newRecord() {
        openEditModal({
            zone: `${domain}.`,
            name: '',
            record_type: RecordTypes.RecordTypeA,
            ttl: 600
        } as Record)
    }

    return (
        <>
            {
                loading ? <Spin size='large' /> :
                    <>
                        <Layout className="records-layout">
                            <Layout.Header className="records-layout-header">
                                <Flex align='center' className="toolbar">
                                    <Flex align="center" gap='small'>
                                        <Button onClick={() => go('/domains')} type="text" icon={<LeftOutlined />} />
                                        <Typography.Title level={1} className="display-as-inline title">{t('domains.dnsRecord')}</Typography.Title>
                                        <Typography.Title level={2} type='secondary' className="display-as-inline subtitle">{domain}</Typography.Title>
                                    </Flex>
                                    <Flex align="center" gap='small' className="right">
                                        <Button type="primary" icon={<PlusOutlined />} onClick={newRecord}>
                                            {t('common.add')}
                                        </Button>
                                        <Input prefix={<SearchOutlined />} placeholder={t('records.search')} onChange={v => setSearchText(v.target.value)} />
                                    </Flex>
                                </Flex>
                            </Layout.Header>
                            <Layout.Content style={{
                                margin: 24,
                                borderRadius: borderRadiusLG,
                                minHeight: 480,
                                background: colorBgContainer,
                            }}>
                                <Table<Record<RecordT>>
                                    dataSource={recordStore.records
                                        .filter(i => i.record_type !== RecordTypes.RecordTypeSOA)
                                        .filter(i => i.name?.includes(searchText) || Object.entries(i.content as RecordT).map(i => i[1]).join(" ").includes(searchText))
                                    }
                                    pagination={{ defaultPageSize: 20 }}
                                    rowKey={e => `${e.id}`}
                                >
                                    <Table.Column<Record<RecordT>> title='#' render={(_v, _r, index) => index + 1} />
                                    <Table.Column<Record<RecordT>> title={t("records.name")} dataIndex='name' key='name' />
                                    <Table.Column<Record<RecordT>> title={t('records.recordType')} dataIndex='record_type' key='record_type' />
                                    <Table.Column<Record<RecordT>> title={t('records.content')} render={(v) => Object.entries(v.content).map(i => i[1]).join(" ")} />
                                    <Table.Column<Record<RecordT>> title='TTL' key='ttl' dataIndex='ttl' />
                                    <Table.Column<Record<RecordT>> key='op' render={(v: Record) =>
                                        <RecordOps
                                            onDelete={() => {
                                                if (domain)
                                                    recordStore.removeRecord(domain, v).catch(e => {
                                                        const msg = getErrorInfo(e as ResponseError)
                                                        notification.error(msg)
                                                        console.error(e)
                                                    })
                                            }} onEdit={() => openEditModal(v)}
                                        />
                                    } />
                                </Table>
                            </Layout.Content>
                        </Layout>
                        <RecordEditModal open={editModalShow} onCancel={closeEditModal}
                            onOk={closeEditModal} record={currentRecord}
                            editRecord={v => recordStore.updateRecord(domain!, v)}
                            createRecord={v => recordStore.addRecord(domain!, v)} />
                    </>
            }
        </>
    )
}