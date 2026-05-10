import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // POS API uses 'token' and 'userId' in headers and request data
      config.headers['token'] = getToken()
      config.headers['userId'] = store.getters.userId || ''
      
      // Also add to params for GET requests or data for POST requests
      if (config.method === 'get') {
        config.params = config.params || {}
        config.params.token = getToken()
        config.params.userId = store.getters.userId || ''
      } else {
        config.data = config.data || {}
        config.data.token = getToken()
        config.data.userId = store.getters.userId || ''
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * Determine the request status by custom code
   * POS API returns code: 1 = success, other = error
   */
  response => {
    const res = response.data

    // if the custom code is not 1, it is judged as an error.
    if (res.code !== 1) {
      Message({
        message: res.msg || res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // -1: Account conflict or token expired
      if (res.code === -1) {
        MessageBox.confirm('您的账号在别处登录或已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || res.message || 'Error'))
    } else {
      // Convert to format that the template expects: code: 20000
      return {
        code: 20000,
        data: res.data,
        message: res.msg || res.message || 'Success'
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
