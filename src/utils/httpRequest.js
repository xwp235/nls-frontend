import axios, {AxiosError} from 'axios'
import axiosRetry from 'axios-retry'
import qs from 'qs'
import { message } from '@/utils/AntdGlobal'

const apiConfig = {
    dev: {
        baseApi: '/api',
        uploadApi: 'http://api-driver-dev.marsview.cc',
        cdn: 'http://xxx.aliyun.com',
        mock: false,
        mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeb1f/api'
    },
    staging: {
        baseApi: '/api',
        uploadApi: 'http://api-driver-stg.marsview.cc',
        cdn: 'http://xxx.aliyun.com',
        mock: false,
        mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeb1f/api'
    },
    prod: {
        baseApi: '/api',
        uploadApi: 'http://api-driver.marsview.cc',
        cdn: 'http://xxx.aliyun.com',
        mock: false,
        mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeb1f/api'
    }
}

const instance = axios.create({
    timeout: 8000,
    timeoutErrorMessage: 'サーバへのリクエストがタイムアウトしました',
    withCredentials: true
})

axiosRetry(instance, {
    retries: 1,
    // 重试条件
    retryCondition: error => {
        return error.code !== 'ERR_BAD_RESPONSE' || error.response?.status !== 500
    }
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        if (config.showLoading) {
            // showLoading()
        }
        const env = document.documentElement.dataset.env
        const envConfig = apiConfig[env]
        if (envConfig.mock) {
            config.baseURL = envConfig.mockApi
        } else {
            config.baseURL = envConfig.baseApi
        }
        return {
            ...config
        }
    },
    throttleErrorCallback(error => {
        const errMsg = error.message ? error.message : error
        // hideLoading()
        message.error(errMsg)
        return Promise.reject(errMsg)
    })
)

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // hideLoading()
        if (response.config.responseType === 'blob') {
            return response
        }
        const data = !(response.request instanceof XMLHttpRequest) ? response : response.data
        // 如果请求是成功的（response的status为200且data的success为true）
        const {msg, success} = data
        if (success) {
            // if (code === 11012 || code === 11011) {
                // 登录过期时要求跳转回登陆页面
                // storage.set(LOGIN_KEEP_STATUS, false)
                // location.href = `/login?callback=${encodeURIComponent(location.href)}`
            // }
            return data.data
        } else {
            if (response.config.showError === false) {
                return Promise.resolve(data)
            } else {
                handleError(new Error(msg))
                return Promise.reject(data)
            }
        }
    },
    throttleErrorCallback(error => {
        // response的状态码不为200时会走这里
        // hideLoading()
        const errMsg = error.message ? error.message : error
        message.error(errMsg)
        return Promise.reject(errMsg)
    })
)

function throttleErrorCallback(callback) {
    const handledErrors = new WeakSet()
    return (error) => {
        if (!(error instanceof AxiosError)) {
            handledErrors.add(new Error(error))
        } else {
            if (handledErrors.has(error)) {
                return Promise.reject(error)
            }
            handledErrors.add(error)
        }
        return callback(error)
    }
}

function handleError(e, callback = () => {
}) {
    if (e instanceof Error) {
        message.error(e.message, () => callback())
    } else {
        message.error('An unknown error occurred.')
    }
}

export default {
    get(url, params, options) {
        return instance.get(url, {params, ...options})
    },
    post (url, data, options) {
        return instance.post(url, data, options)
    },
    postForm(url, data, options) {
        return instance.post(url, qs.stringify(data, {arrayFormat: 'indices'}), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            ...options
        })
    },
    downloadFile(url, data, options, fileName = 'fileName.xlsx') {
        instance({
            url,
            data,
            method: 'post',
            responseType: 'blob',
            ...options
        }).then(response => {
            const blob = new Blob([response.data], {
                type: response.data.type
            })
            const name = response.headers['file-name'] || fileName
            const link = document.createElement('a')
            link.download = decodeURIComponent(name)
            link.href = URL.createObjectURL(blob)
            document.body.append(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(link.href)
        })
    },
    uploadFile(url, data, options) {
        return instance.post(url, data, {
            transformRequest: [
                function (data) {
                    const formData = new FormData()
                    for (const key of Object.keys(data)) {
                        if (data[key] instanceof Array && data[key][0] instanceof File) {
                            data[key].forEach((e) => {
                                formData.append(key, e, e.name)
                            })
                        } else {
                            formData.append(key, data[key])
                        }
                    }
                    return formData
                }
            ],
            headers: {'Content-Type': 'multipart/form-data'},
            ...options
        })
    }
}
