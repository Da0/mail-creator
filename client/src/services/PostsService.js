import api from '@/services/api'

export default {
  fetchPosts () {
    return api().get('posts')
  },
  addNewPost (params) {
    return api().post('posts', params)
  },
  getPost (params) {
    return api().get(`posts/${params.id}`)
  },
  updatePost (params) {
    return api().put(`posts/${params.id}`, params)
  },
  deletePost (id) {
    return api().delete(`posts/${id}`)
  },
  imgLoad (formData, autoTrim) {
    return api().post(`posts/img:${autoTrim}`,
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
    return api().delete(`posts/img/${title}`)
  }
}
