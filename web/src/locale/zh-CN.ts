export default {
    common: {
        delete: '删除',
        remove: '删除',
        deleteConfirm: '确定要删除吗？',
        removeConfirm: '确定要删除吗？',
        edit: '修改',
        add: '新增',
        new: '新增',
    },
    api: {
        error400: {
            title: '请求错误 (400)',
            content: '参数提交错误'
        },
        error401: {
            title: '未授权 (401)',
            content: '请刷新页面重新登录'
        },
        error403: {
            title: '拒绝访问 (403)',
            content: '你没有权限！'
        },
        error404: {
            title: '查无此项 (404)',
            content: '没有该项内容'
        },
        error500: {
            title: "服务器错误 (500)",
            content: "请检查系统日志"
        },
        errorUnknown: {
            title: "未知错误",
            content: "请打开控制台了解详情",
        }
    },
    domains: {
        dnsRecord: 'DNS 记录'
    },
    records: {
        name: '记录名',
        recordType: '类型',
        content: '记录值',
        search: '搜索...',

        refresh: '刷新时间',
        retry: '重试间隔',
        expire: '超期时间',
        ttl: '缓存时间',
    }
}