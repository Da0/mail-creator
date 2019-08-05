import api from '@/services/api'

export default {
    fetchParams () {
        return api().get('params')
    },
    updateParams (params) {
        return api().post('params', params)
    }
}