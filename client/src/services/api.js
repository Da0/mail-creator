import axios from 'axios'
const config = require('../../../server/src/config/config');

export default () => {
  return axios.create({
    baseURL: config.host + ':' + config.port
  })
}
