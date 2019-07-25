import Vue from 'vue'
import Vuex from 'vuex'
// import { getToken, getUser} from '@/util'

Vue.use(Vuex)


const toJson= (str)=>{
	try {
		if (typeof JSON.parse(str) == "object") {
			return JSON.parse(str);
		}
	} catch(e) {}
	return false;
}
let token= localStorage.getItem('ACCESSTOKEN')
let userInfo= localStorage.getItem('USERINFO')

export default new Vuex.Store({
	state: {
		token:  token || '',
		userInfo:  toJson(userInfo) || {},
	},
	mutations: {
		setToken (state, token) {
			state.token = token
			if(token) localStorage.setItem('ACCESSTOKEN', token)
		},
		setUser (state, info) {
			if(info){
				state.userInfo = info
				localStorage.setItem('USERINFO', JSON.stringify(info))
			}else{
				state.userInfo = {}
			}
		},
	},
	actions: {
		login({ commit }, data){
			commit('setToken', data.item.accessToken)
			commit('setUser', data.item)
		},
		logout({ commit }){
			localStorage.removeItem('ACCESSTOKEN')
			localStorage.removeItem('USERINFO')
			commit('setToken', '')
			commit('setUser', '')
		}
	}
})
