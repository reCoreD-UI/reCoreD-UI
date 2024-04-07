import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { useLoadingBar, useNotification } from 'naive-ui'
import { type Record } from '@/stores/records';
import { type Domain } from "@/stores/domains";

type Result<T> = {
    success: boolean
    message: string
    data: T
}

export class Request {
    private instance: AxiosInstance;
    private baseConfig: AxiosRequestConfig = { baseURL: "api/v1" }
    private loadingBar = useLoadingBar()
    private notification = useNotification()
    private messages = new Map<number, {
        title: string, content: string
    }>(
        // TODO: i18n
        [
            [400, {
                title: "请求错误 (400)",
                content: "参数提交错误"
            }],
            [401, {
                title: "未授权 (401)",
                content: "请刷新页面重新登录"
            }],
            [403, {
                title: "拒绝访问 (403)",
                content: "你没有权限！"
            }],
            [404, {
                title: "查无此项 (404)",
                content: "没有该项内容"
            }],
            [500, {
                title: "服务器错误 (500)",
                content: "请检查系统日志"
            }]
        ]
    )
    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(Object.assign(this.baseConfig, config))
        this.setupInceptors()
    }

    private setupInceptors() {
        this.setupRequestInterceptors()
        this.setupResponseInterceptors()
    }

    private setupRequestInterceptors() {
        const fulFilled = (res: InternalAxiosRequestConfig<any>) => {
            this.loadingBar.start()
            return res
        }
        const onError = (err: any) => {
            this.loadingBar.error()
            return Promise.reject(err)
        }

        this.instance.interceptors.request.use(fulFilled, onError)
    }

    private setupResponseInterceptors() {
        const fulFilled = (res: AxiosResponse) => {
            this.loadingBar.finish()
            return res
        }
        const onError = (err: any) => {
            this.loadingBar.error()

            const msg = this.messages.get(err.response.status)
            if (msg) {
                this.notification.error(msg)
            } else {
                console.log(err.response)
                this.notification.error({
                    title: "未知错误",
                    content: "请打开控制台了解详情"
                })
            }

            return Promise.reject(err.response)
        }

        this.instance.interceptors.response.use(fulFilled, onError)
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