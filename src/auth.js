import router from './router'
import store from './store'

let getMenu=()=>{
	return store.state.userInfo.items|| []
}
let menu=()=>{
	let arr= router.routes, list=[]
	for(let i in arr){
		if(arr[i].name=='main'){
			arr[i].children.map((item)=>{
				getMenu().map((item2)=>{
					if(item.path== item2.uri){
						list.push(item)
					}
				})
			})
		}
	}
	return list
}

router.beforeEach((to, from, next) => {
	let imgs= document.querySelector('.fullscreen-v-img .buttons-v-img span')
	if(imgs) imgs.click()
	let redirect= to.fullPath, isLogin= !!store.state.token, toLogin= to.name== 'login'
	// if (to.meta.tourist) {
	// 	next()
	// } else {
	// 	if (isLogin) {
	// 		next()
	// 	} else {
	// 		next({path: '/login', query: { redirect: redirect }})
	// 	}
	// }

	if (isLogin) {
		if(toLogin){
			next({path: menu()[0].path, replace: true})
		}else next()
	} else {
		if (to.meta.tourist) {
			next()
		} else {
			next({path: '/login', query: { redirect: redirect }})
		}
	}
})

router.afterEach((to, from) => {

})


