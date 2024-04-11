import './DomainInfo.css'

import { type Domain } from "../../stores/domains";
import { NIcon } from "naive-ui";
import { AddressCard, Server } from "@vicons/fa";
import { defineComponent, defineProps } from "vue";

type Props = {
    domain: Domain
}

function DomainInfo({domain}: Props) {
    return (
        <div>
            <p>
                <NIcon class="icon" component={AddressCard} />
                <span> {domain.admin_email}</span>
            </p>
            <p>
                <NIcon class="icon" component={Server} />
                <span> {domain.main_dns}</span>
            </p>
        </div>
    )
}

export default DomainInfo