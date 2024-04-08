import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { type Record } from '@/stores/records';
import { type Domain } from "@/stores/domains";

import i18n from "@/locale/i18n";

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
    [
        [400, {
            title: i18n.global.t("api.error400.title"),
            content: i18n.global.t("api.error400.content"),
            duration: notificationDuration
        }],
        [401, {
            title: i18n.global.t("api.error401.title"),
            content: i18n.global.t("api.error401.content"),
            duration: notificationDuration
        }],
        [403, {
            title: i18n.global.t("api.error403.title"),
            content: i18n.global.t("api.error403.content"),
            duration: notificationDuration
        }],
        [404, {
            title: i18n.global.t("api.error404.title"),
            content: i18n.global.t("api.error404.content"),
            duration: notificationDuration
        }],
        [500, {
            title: i18n.global.t("api.error500.title"),
            content: i18n.global.t("api.error500.content"),
            duration: notificationDuration
        }]
    ]
)

export function getErrorInfo(err: any)  {
    const msg = messages.get(err.response.status)
    return msg? msg: {
        title: i18n.global.t("api.errorUnknown.title"),
        content: i18n.global.t("api.errorUnknown.content"),
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