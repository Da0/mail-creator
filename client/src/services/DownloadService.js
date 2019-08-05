import api from '@/services/api'

export default {
    start () {
        return api().get('download')
    }
}