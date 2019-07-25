import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {

	let imgs= document.querySelector('.fullscreen-v-img .buttons-v-img span')
	if(imgs) imgs.click()
	let redirect= to.fullPath
	if (to.meta.tourist) {
		next()
	} else {
		if (store.state.token) {
			next()
		} else {
			next({path: '/login', query: { redirect: redirect }})
		}
	}
})

router.afterEach((to, from) => {

})
