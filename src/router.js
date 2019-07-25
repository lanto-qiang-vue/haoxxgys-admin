import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main.vue'
Vue.use(Router)

export default new Router({
routes: [
	{
		path: '/',
		name: 'index',
		redirect: '/login',
	},
	{
		path: '/login',
		name: 'login',
		meta:{
			tourist: true
		},
		component: () => import('@/views/login.vue')
	},
	{
		path: '/main',
		alias: '/',
		component: Main,
		children: [
			{
				path: '/change-pass',
				name: 'change-pass',
				meta:{
					name: '修改密码'
				},
				component: () => import('@/views/change-pass.vue')
			},
			{
				path: '/compare',
				name: 'compare',
				meta:{
					name: '保险理赔数据比对',
				},
				component: () => import('@/views/compare.vue')
			},
		]
	},
]
})
