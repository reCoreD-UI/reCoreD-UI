import { App, Form, Input, InputNumber, Modal, Select } from 'antd'
import i18n from '../../locale'
import { AAAARecord, ARecord, CAARecord, CNAMERecord, MXRecord, NSRecord, Record, RecordTypes, SRVRecord, TXTRecord } from '../../stores/records'
import { useEffect, useState } from 'react'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { ResponseError, getErrorInfo } from '../../api'
import { FormInstance } from 'antd/lib/form/Form'
const { t } = i18n

type Props = {
    open: boolean
    record: Record
    //domain: string
    onCancel(): void
    onOk(): void

    editRecord(record: Record): Promise<void>
    createRecord(record: Record): Promise<void>
}

const recordTypeOptions = Object.entries(RecordTypes).filter(e => e[1] !== RecordTypes.RecordTypeSOA).map(e => {
    return {
        value: e[1],
        label: e[1]
    }
})

export default function RecordEditModal({ open, record, onOk, onCancel, editRecord, createRecord }: Props) {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm<Record>()
    const { notification } = App.useApp()

    useEffect(() => { form.setFieldsValue(record) }, [open])

    async function confirm() {
        const commitFunction = (!record.id || record.id < 1) ? createRecord : editRecord
        setLoading(true)
        try {
            record = await form.validateFields()
            await commitFunction(record)
            onOk()
        } catch (error) {
            const msg = getErrorInfo(error as ResponseError)
            notification.error(msg)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const controls = new Map<RecordTypes, (f: FormInstance<Record>) => JSX.Element>([
        [
            RecordTypes.RecordTypeA, (
                ({ getFieldValue }) =>
                    <Form.Item<Record<ARecord>> label='IP' name={['content', 'ip']} required rules={[{
                        validator() {

                            const result = ARecord.validate(getFieldValue('content') as ARecord)
                            return (result === true) ? Promise.resolve() : Promise.reject(result)
                        }
                    }]}>
                        <Input />
                    </Form.Item>
            )
        ],
        [
            RecordTypes.RecordTypeAAAA, (
                ({ getFieldValue }) =>
                    <Form.Item<Record<AAAARecord>> label='IP' name={['content', 'ip']} required rules={[{
                        validator() {
                            const result = AAAARecord.validate(getFieldValue('content') as AAAARecord)
                            return (result === true) ? Promise.resolve() : Promise.reject(result)
                        }
                    }]}>
                        <Input />
                    </Form.Item>
            )
        ],
        [
            RecordTypes.RecordTypeCNAME, (
                ({ getFieldValue }) =>
                    <Form.Item<Record<CNAMERecord>> label={t('records.form.host')} required name={['content', 'host']}
                        rules={[{
                            validator() {
                                const result = CNAMERecord.validate(getFieldValue('content') as CNAMERecord)
                                return (result === true) ? Promise.resolve() : Promise.reject(result)
                            }
                        }]}>
                        <Input />
                    </Form.Item>
            )
        ],
        [
            RecordTypes.RecordTypeNS, (
                ({ getFieldValue }) =>
                    <Form.Item<Record<NSRecord>> label={t('records.form.host')} name={['content', 'host']} required
                        rules={[{
                            validator() {
                                const result = NSRecord.validate(getFieldValue('content') as NSRecord)
                                return (result === true) ? Promise.resolve() : Promise.reject(result)
                            }
                        }]}>
                        <Input />
                    </Form.Item>
            )
        ],
        [
            RecordTypes.RecordTypeTXT, (
                ({ getFieldValue }) =>
                    <Form.Item<Record<TXTRecord>> label={t('records.form.text')} name={['content', 'text']} required
                        rules={[{
                            validator() {
                                const result = TXTRecord.validate(getFieldValue('content') as TXTRecord)
                                return (result === true) ? Promise.resolve() : Promise.reject(result)
                            }
                        }]}>
                        <Input />
                    </Form.Item>
            )
        ],
        [
            RecordTypes.RecordTypeMX, (
                ({ getFieldValue }) =>
                    <>
                        <Form.Item<Record<MXRecord>> label={t('records.form.host')} name={['content', 'host']} required
                            rules={[{
                                validator() {
                                    const result = MXRecord.validate(getFieldValue('content') as MXRecord)
                                    return (result === true) ? Promise.resolve() : Promise.reject(result)
                                }
                            }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item<Record<MXRecord>> label={t('records.form.preference')} name={['content', 'preference']} required>
                            <InputNumber controls={false} />
                        </Form.Item>
                    </>
            )
        ],
        [
            RecordTypes.RecordTypeCAA, (
                ({ getFieldValue }) =>
                    <>
                        <Form.Item<Record<CAARecord>> label={t('records.form.flag')} name={['content', 'flag']} required>
                            <InputNumber controls={false} />
                        </Form.Item>
                        <Form.Item<Record<CAARecord>> label={t('records.form.tag')} name={['content', 'tag']} required rules={[{
                            validator() {
                                const result = CAARecord.validate(getFieldValue('content') as CAARecord)
                                return (result === true) ? Promise.resolve() : Promise.reject(result)
                            }
                        }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item<Record<CAARecord>> label={t('records.form.value')} name={['content', 'value']} required rules={[
                            { required: true, message: t('common.mandatory') }
                        ]} >
                            <Input />
                        </Form.Item>
                    </>
            )
        ],
        [
            RecordTypes.RecordTypeSRV, (
                ({ getFieldValue }) =>
                    <>
                        <Form.Item<Record<SRVRecord>> label={t('records.form.priority')} name={['content', 'priority']} required>
                            <InputNumber controls={false} />
                        </Form.Item>

                        <Form.Item<Record<SRVRecord>> label={t('records.form.weight')} name={['content', 'weight']} required>
                            <InputNumber controls={false} />
                        </Form.Item>

                        <Form.Item<Record<SRVRecord>> label={t('records.form.port')} name={['content', 'port']} required>
                            <InputNumber controls={false} />
                        </Form.Item>

                        <Form.Item<Record<SRVRecord>> label={t('records.form.target')} name={['content', 'target']} required rules={[{
                            validator() {
                                const result = SRVRecord.validate(getFieldValue('content') as SRVRecord)
                                return (result === true) ? Promise.resolve() : Promise.reject(result)
                            }
                        }]}>
                            <Input />
                        </Form.Item>
                    </>
            )
        ]
    ])

    return (
        <Modal
            onCancel={onCancel} onOk={confirm}
            title={
                <span>
                    {
                        (!record || !record.id || record.id < 1) ? t('common.new') : t('common.edit')
                    }
                    {
                        t('records._')
                    }
                </span>
            }
            confirmLoading={loading}
            cancelButtonProps={{
                icon: <CloseOutlined />,
            }}
            okButtonProps={{
                icon: <CheckOutlined />,
                htmlType: 'submit'
            }}

            open={open}
            closeIcon={false}
            maskClosable={false}

            centered
            destroyOnClose
            forceRender
        >
            <Form<Record> name='record' form={form}
                scrollToFirstError
                autoComplete='off'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateTrigger='onBlur'
            >
                <Form.Item<Record> label={t('records.recordType')} required name='record_type'>
                    <Select allowClear={false} options={recordTypeOptions} />
                </Form.Item>
                <Form.Item<Record> label={t('records.name')} required name='name' rules={[
                    {
                        validator(_rule, value) {
                            const result = Record.validateName(value)
                            return (result === true) ? Promise.resolve() : Promise.reject(result)
                        },
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item<Record> label='TTL' required name='ttl'>
                    <InputNumber controls={false} addonAfter={t('common.unitForSecond')} />
                </Form.Item>
                <Form.Item<Record> noStyle shouldUpdate={(p, c) => p.record_type !== c.record_type}>
                    {
                        ({ getFieldValue }: FormInstance<Record>) => {
                            const e = controls.get(getFieldValue('record_type'))
                            if (!e) {
                                return <></>
                            }
                            return e({ getFieldValue } as FormInstance<Record>)
                        }
                    }
                </Form.Item>
            </Form>
        </Modal>
    )
}