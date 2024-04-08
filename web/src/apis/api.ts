import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { type Record } from '@/stores/records';
import { type Domain } from "@/stores/domains";

type Result<T> = {
    success: boolean
    message: string
    data: T
}

// 5 second.
const notificationDuration = 5000
const messages = new Map<number, {
    title: string, content: string, duration: number
}>(
    // TODO: i18n
    [
        [400, {
            title: "请求错误 (400)",
            content: "参数提交错误",
            duration: notificationDuration
        }],
        [401, {
            title: "未授权 (401)",
            content: "请刷新页面重新登录",
            duration: notificationDuration
        }],
        [403, {
            title: "拒绝访问 (403)",
            content: "你没有权限！",
            duration: notificationDuration
        }],
        [404, {
            title: "查无此项 (404)",
            content: "没有该项内容",
            duration: notificationDuration
        }],
        [500, {
            title: "服务器错误 (500)",
            content: "请检查系统日志",
            duration: notificationDuration
        }]
    ]
)

export function getErrorInfo(err: any)  {
    const msg = messages.get(err.response.status)
    return msg? msg: {
        title: "未知错误",
        content: "请打开控制台了解详情",
        duration: notificationDuration
    }
}

export class Request {
    private instance: AxiosInstance;
    private baseConfig: AxiosRequestConfig = { baseURL: "api/v1" }

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(Object.assign(this.baseConfig, config))

    }

    public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.request(config)
    }

    public get<T = Record[] | Domain[]>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
        return this.instance.get(url, config)
    }

    public post<T = Record | Domain>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
        return this.instance.post(url, data, config)
    }

    public put<T = Record | Domain>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<null>>> {
        return this.instance.put(url, data, config)
    }

    public delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<null>>> {
        return this.instance.delete(url, config)
    }
}

export default new Request({})