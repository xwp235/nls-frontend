import request from '@/utils/httpRequest'

export default {
    getUploadCredential(params) {
        return request.post('/web/vod/get-upload-auth', params, {showLoading: false,showError: true})
    },
    calcAmount(videoId) {
        return request.get(`/web/vod/calc-amount/${videoId}`,{showLoading: false,showError: true})
    },
    pay(params) {
        return request.post('/web/file-trans/pay',params, {showLoading: false,showError: true})
    }
}
