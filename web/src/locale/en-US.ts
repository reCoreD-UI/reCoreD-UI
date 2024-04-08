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
        dnsRecord: 'DNS Record',
        delete: 'Remove Domain',
        deleteHint: 'All records of this domain will be WIPED!',
        confirm1: 'Please input',
        confirm2: 'for comfirmation'
    },
    records: {
        name: 'Record Name',
        recordType: 'Type',
        content: 'Record',
        search: 'Search...',

        refresh: 'Refresh Interval',
        retry: 'Retry Interval',
        expire: 'Expiry Period',
        ttl: 'Negative TTL',
    }
}