import { Button, Flex, Popconfirm, Tooltip } from "antd"
import { DeleteOutlined, EditFilled } from "@ant-design/icons"
import i18n from '../../locale'

const { t } = i18n

type Props = {
    onEdit(): void
    onDelete(): void
}

export default function RecordOps({ onEdit, onDelete }: Props) {
    return (
        <Flex justify="end" gap='small'>
            <Tooltip title={t("common.edit")}>
                <Button icon={<EditFilled />} size="small" onClick={onEdit}/>
            </Tooltip>

            <Popconfirm onConfirm={onDelete} title={t("common.deleteConfirm")}>
                <Tooltip title={t("common.delete")}>
                    <Button danger type="primary" icon={<DeleteOutlined />} size="small" />
                </Tooltip>
            </Popconfirm>
        </Flex>
    )
}