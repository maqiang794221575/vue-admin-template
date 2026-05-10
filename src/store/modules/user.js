import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userId: localStorage.getItem('userId') || '',
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login - simplified for demo
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // Simulate login without calling real API
      const mockToken = 'demo-token-' + Date.now()
      const mockUserId = '1'
      
      commit('SET_TOKEN', mockToken)
      commit('SET_USERID', mockUserId)
      setToken(mockToken)
      localStorage.setItem('userId', mockUserId)
      resolve()
    })
  },

  // get user info - simplified for demo
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // Simulate get user info
      const mockData = {
        name: '管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f4-4f49-b7aa-9ebf4fc4c6a6.png'
      }
      
      commit('SET_NAME', mockData.name)
      commit('SET_AVATAR', mockData.avatar)
      resolve(mockData)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      localStorage.removeItem('userId')
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      localStorage.removeItem('userId')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

