import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { type Record } from '../stores/records'
import { type Domain } from "../stores/domains"
import i18n from "../locale"

type Result<T> = {
    success: boolean
    message: string
    data: T
}

const t = i18n.t
// 5 second.
const notificationDuration = 5000
const messages = new Map<number, {
    message: string, description: string, duration: number
}>(
    [
        [400, {
            message: t("api.error400.title"),
            description: t("api.error400.content"),
            duration: notificationDuration
        }],
        [401, {
            message: t("api.error401.title"),
            description: t("api.error401.content"),
            duration: notificationDuration
        }],
        [403, {
            message: t("api.error403.title"),
            description: t("api.error403.content"),
            duration: notificationDuration
        }],
        [404, {
            message: t("api.error404.title"),
            description: t("api.error404.content"),
            duration: notificationDuration
        }],
        [500, {
            message: t("api.error500.title"),
            description: t("api.error500.content"),
            duration: notificationDuration
        }]
    ]
)

export interface ResponseError {
    response: {
        status: number
    }
}

export function getErrorInfo(err: ResponseError) {
    const msg = messages.get(err.response.status)
    return msg ? msg : {
        message: t("api.errorUnknown.title"),
        description: t("api.errorUnknown.content"),
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