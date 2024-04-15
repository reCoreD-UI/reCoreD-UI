import { GlobalOutlined, MailOutlined } from "@ant-design/icons"
import { Domain } from "../../stores/domains"
import './DomainInfo.css'

type Props = {
    domain: Domain
}

export default function DomainInfo({ domain }: Props) {
    return (
        <>
            <p>
                <MailOutlined className="icon-info" />
                <span className="info">{domain.admin_email}</span>
            </p>
            <p>
                <GlobalOutlined className="icon-info" />
                <span className="info">{domain.domain_name}</span>
            </p>
        </>
    )
}