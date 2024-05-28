import request from '@/utils/httpRequest'

export default {
    register(params) {
        return request.post('/web/member/register', params, {showLoading: false,showError: false})
    },
    login(params) {
        return request.post('/web/member/login', params, {showLoading: false,showError: false})
    }
}
