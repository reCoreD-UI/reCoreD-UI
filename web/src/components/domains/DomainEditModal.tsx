import { App, Form, FormInstance, Input, InputNumber, Modal, Space } from "antd"
import { Domain } from "../../stores/domains"
import i18n from '../../locale'
import { useEffect, useState } from "react"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { ResponseError, getErrorInfo } from "../../api"
const { t } = i18n

type Props = {
    open: boolean
    domain: Domain
    editDomain(domain: Domain): Promise<void>
    createDomain(domain: Domain): Promise<void>
    onCancel(): void
    onOk(): void
}

export default function DomainEditModal({ open, domain, editDomain, createDomain, onCancel, onOk }: Props) {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm<Domain>()
    const { notification } = App.useApp()

    useEffect(() => {
        form.setFieldsValue(domain)
    }, [open])

    async function confirm() {
        const commitFunction = (!domain.id || domain.id < 1) ? createDomain : editDomain
        setLoading(true)
        try {
            domain = await form.validateFields()
            await commitFunction(domain)
            onOk()
        } catch (error) {
            const msg = getErrorInfo(error as ResponseError)
            notification.error(msg)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    function easyInput(form: FormInstance<Domain>, domain_name: string) {
        form.setFieldValue('admin_email', `admin@${domain_name}`)
        form.setFieldValue('main_dns', `ns1.${domain_name}`)
    }

    return (
        <Modal
            onCancel={onCancel} onOk={confirm}
            title={
                <span>
                    {
                        (!domain || !domain.id || domain.id < 1) ? t('common.new') : t('common.edit')
                    }
                    {
                        t('domains._')
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
            <Form<Domain> name="domain" form={form}
                scrollToFirstError
                autoComplete="off"
            >
                <Form.Item<Domain> hidden name='id' />
                <Form.Item<Domain>
                    label={t('domains._')}
                    name='domain_name'
                    rules={[
                        { required: true, message: t('common.mandatory') },
                        { pattern: /^([\w-]+\.)+[\w-]+$/, message: t('domains.errors.domainName') },
                    ]}
                >
                    <Input placeholder='example.com' onChange={v => easyInput(form, v.target.value)} />
                </Form.Item>
                <Form.Item<Domain>
                    label={t('domains.form.mainDNS')}
                    name='main_dns'
                    rules={[
                        { required: true, message: t('common.mandatory') },
                        { pattern: /^([\w-]+\.)+[\w-]+$/, message: t('domains.errors.domainName') },
                    ]}
                >
                    <Input placeholder="ns1.example.com" />
                </Form.Item>
                <Form.Item<Domain>
                    label={t('domains.form.adminMail')}
                    name='admin_email'
                    rules={[
                        { required: true, message: t('common.mandatory') },
                        { pattern: /^[\w-.]+@([\w-]+\.)+[\w-]+$/, message: t('domains.errors.mail') }
                    ]}
                >
                    <Input placeholder="admin@example.com" />
                </Form.Item>
                <Space>
                    <Form.Item<Domain> name='refresh_interval' label={t('records.refresh')}>
                        <InputNumber controls={false} addonAfter={t('common.unitForSecond')} />
                    </Form.Item>
                    <Form.Item<Domain> name='retry_interval' label={t('records.retry')}>
                        <InputNumber controls={false} addonAfter={t('common.unitForSecond')} />
                    </Form.Item>
                </Space>
                <Space>
                    <Form.Item<Domain> name='expiry_period' label={t('records.expire')}>
                        <InputNumber controls={false} addonAfter={t('common.unitForSecond')} />
                    </Form.Item>
                    <Form.Item<Domain> name='negative_ttl' label={t('records.ttl')}>
                        <InputNumber controls={false} addonAfter={t('common.unitForSecond')} />
                    </Form.Item>
                </Space>
            </Form>
        </Modal>
    )
}