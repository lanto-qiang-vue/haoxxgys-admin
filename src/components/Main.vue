<template>
<div class="main">
	<div class="header">
	<div class="center">
		<img class="logo" src="~@/assets/img/hoxiuxiu-logo.png"/>

		<div class="right">
			您好，<b>{{$store.state.userInfo?$store.state.userInfo.companyName:''}}</b>
			<a @click="changePass">修改密码</a> |
			<a @click="logout">退出</a>
		</div>
	</div>
	</div>
	<Layout>
		<Sider hide-trigger class="left-side" :width="160">
			<Menu :active-name="path" width="auto">
				<MenuItem v-for="(item, key) in menu" :key="key" v-show="!item.meta.hideMenu"
				          :name="item.path" :to="item.path">{{item.meta.name}}</MenuItem>
			</Menu>
		</Sider>
		<Content>
			<div class="body">
				<div class="sub-title">
					<Breadcrumb><BreadcrumbItem>{{title}}</BreadcrumbItem></Breadcrumb>
				</div>
				<div style="padding: 10px">
					<router-view></router-view>
				</div>
			</div>
		</Content>
	</Layout>
	<foot></foot>
</div>
</template>

<script>
import Foot from '@/components/Footer.vue'
export default {
	name: "main-body",
	components: { Foot},
	computed:{
		title(){
			return this.$route.meta.name
		},
		path(){
			return this.$route.path
		},
		menu(){
			let arr= this.$router.routes, list=[]
			for(let i in arr){
				if(arr[i].name=='main'){
					list= arr[i].children
				}
			}
			return list
		}
	},
	mounted(){
		// console.log(this.$store.state.userInfo)
		// console.log('router.routes', router.routes)
		// console.log('this.$router.routes', this.$route)
	},
	methods:{
		changePass(){
			this.$router.push({path: '/change-pass'})
		},
		logout(){
			this.$Modal.confirm({
				title: '确定退出登录吗？',
				content:'',
				onOk: ()=> {
					this.axios.get('/supplier/user/logout')
					this.$store.dispatch('logout');
					this.$router.push({
						path: '/login',
					})
				}
			})
		}
	}
}
</script>

<style scoped lang="less">
.main{
	background-color: #FAFAFA;
	.header{
		background-color: white;
		border-bottom: 2px solid #064998;
		text-align: center;
		box-shadow:0 1px 4px 0 rgba(0,21,41,0.12);
		.center{
			max-width: 1200px;
			display: inline-block;
			padding: 0 10px;
			line-height: 60px;
			height: 60px;
			text-align: left;
			width: 100%;
			.logo{
				height: 40px;
				vertical-align: middle;
			}
			.right{
				cursor: default;
				float: right;
				font-size: 14px;
				color: #333333;
				b{
					font-size: 16px;
					font-weight: 600;
					color: black;
					padding: 0 10px;
					margin-right: 20px;
				}
				a{
					display: inline-block;
					margin: 0 5px;
				}
			}
		}
	}
	.left-side{
		background-color: white;
		.ivu-menu-vertical.ivu-menu-light:after{
			background: none;
		}
		.ivu-menu-item:hover, .ivu-menu-submenu-title:hover {
			background-color: #f1f1f1;
		}
	}
	.body{
		background-color: white;
		margin: 10px;
		min-height: 600px;
		overflow: hidden;
		.sub-title{
			line-height: 38px;
			padding: 0 10px;
			background-color: white;
			box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
		}
	}
}
</style>
