import api from '@/services/api'

export default {
    fetchBanners () {
        return api().get('banners')
    },
    addNewBanner (params) {
        return api().post('banners', params)
    },
    getBanner (params) {
        return api().get(`banners/${params.id}`)
    },
    updateBanner (params) {
        return api().put(`banners/${params.id}`, params)
    },
    deleteBanner (id) {
        return api().delete(`banners/${id}`)
    },
    imgLoad (formData) {
        return api().post('banners/img',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(function(){
            console.log('SUCCESS!!');
        })
        .catch(function(){
            console.log('FAILURE!!');
        });
    },
    imgDelete (title) {
        return api().delete(`banners/img/${title}`)
    }
}