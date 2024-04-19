export default {
    common: {
        delete: 'Remove',
        remove: 'Remove',
        deleteConfirm: 'Are you sure?',
        removeConfirm: 'Are you sure?',
        edit: 'Edit',
        add: 'New',
        new: 'New',
        cancel: 'Cancel',
        confirm: 'OK',
        mandatory: 'This field is mandatory',
        unitForSecond: 'Second(s)'
    },
    api: {
        error400: {
            title: 'Bad Request (400)',
            content: 'Bad Parameters'
        },
        error401: {
            title: 'Unauthorized (401)',
            content: 'Refresh page and relogin'
        },
        error403: {
            title: 'Forbbiden (403)',
            content: 'Permission denied'
        },
        error404: {
            title: 'Not Found (404)',
            content: 'No such content'
        },
        error500: {
            title: "Internal Server Error (500)",
            content: "Check server log, please"
        },
        errorUnknown: {
            title: "Unknown Error",
            content: "Open console for details",
        }
    },
    domains: {
        '_': 'Domain',
        dnsRecord: 'DNS Record',
        delete: 'Remove Domain',
        deleteHint: 'All records of this domain will be WIPED!',
        confirm1: 'Please input',
        confirm2: 'for comfirmation',

        form: {
            adminMail: 'Admin Email',
            mainDNS: 'Main DNS',
        },

        errors: {
            domainName: 'Invalid domain name',
            mail: 'Invalid email',
        }
    },
    records: {
        '_': 'Record',
        name: 'Resource Record',
        recordType: 'Type',
        content: 'Record',
        search: 'Search...',

        refresh: 'Refresh Interval',
        retry: 'Retry Interval',
        expire: 'Expiry Period',
        ttl: 'Negative TTL',

        form: {
            text: 'Text',
            host: 'Host',
            preference: 'Preference',
            priority: 'Priority',
            weight: 'Weight',
            port: 'Port',
            target: 'Target',
            flag: 'Flag',
            tag: 'Tag',
            value: 'Value'
        },

        errors: {
            endWithDot: 'should end with a dot',
            hasSpace: 'shoule have no space',
            badIPv4: 'invalid IPv4 address',
            badIPv6: 'invalid IPv6 address',
            badEmail: 'no @ for this email address',
            badName: {
                dotAndMinus: 'should not start or end with "." "-"',
                doubleDots: 'should have no contianus "."',
                logerThan63: 'should not longer than 63 characters splited by "."'
            },
            tooLong: 'too long'
        }
    }
}