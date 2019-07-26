import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview';
import axios from './axios.js'
import '@/auth.js'
import 'iview/dist/styles/iview.css';
import '@/assets/common.less'

Vue.use(iView);
Vue.config.productionTip = false
Vue.prototype.axios = axios;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
