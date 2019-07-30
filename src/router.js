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
			{
				path: '/invoice',
				name: 'invoice',
				meta:{
					name: '发货列表',
				},
				component: () => import('@/views/invoice.vue')
			},
			{
				path: '/supplier-manage',
				name: 'supplier-manage',
				meta:{
					name: '供应商管理',
				},
				component: () => import('@/views/manage/supplier.vue')
			},
			{
				path: '/user-manage',
				name: 'user-manage',
				meta:{
					name: '用户管理',
				},
				component: () => import('@/views/manage/user.vue')
			},
		]
	},
]

let router=  new Router({
	routes
})
router.__proto__.routes= routes
// console.log('router.routes', router.routes)

export default router
