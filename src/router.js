import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main.vue'
Vue.use(Router)

let routes= [
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
		name: 'main',
		path: '/main',
		alias: '/',
		component: Main,
		children: [
			{
				path: '/change-pass',
				name: 'change-pass',
				meta:{
					name: '修改密码',
					hideMenu: true
				},
				component: () => import('@/views/change-pass.vue')
			},
			{
				path: '/dispatch',
				name: 'dispatch',
				meta:{
					name: '预约单发货',
				},
				component: () => import('@/views/dispatch.vue')
			},
			{
				path: '/goods',
				name: 'goods',
				meta:{
					name: '商品管理',
				},
				component: () => import('@/views/goods.vue')
			},

		]
	},
]

let router=  new Router({
	routes
})
router.__proto__.routes= routes
console.log('router.routes', router.routes)

export default router
