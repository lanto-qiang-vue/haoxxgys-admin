<template>
	<div class="change-pass">
		<Form ref="fromPass" :rules="rulePass"  :model="fromPass"  :label-width="130" style="width: 350px">
			<FormItem label="用户昵称:">
				<span>{{$store.state.userInfo?$store.state.userInfo.nickname: ''}}</span>
			</FormItem>
			<FormItem  label="当前登录密码:" prop="oldPassword">
				<Input type="password" v-model="fromPass.oldPassword"  size="large" placeholder="请输入当前登录密码"></Input>
			</FormItem>
			<FormItem   label="新登录密码:" prop="newPassword">
				<Input type="password" v-model="fromPass.newPassword"  size="large" placeholder="请输入新登录密码"></Input>
			</FormItem>
			<FormItem   label="确认新登录密码:" prop="rePassword">
				<Input type="password" v-model="fromPass.rePassword"  size="large" placeholder="请再次输入登录密码"></Input>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="commitFun('fromPass')">确定</Button>
				<Button style="margin-left: 10px;" @click="$router.go(-1)">取消</Button>
			</FormItem>
		</Form>
	</div>
</template>

<script>
	export default {
		name: "change-pass",
		data(){
			return{
				fromPass:{
					"newPassword": "",
					"oldPassword": "",
					"rePassword": ""
				},
				rulePass:{
					oldPassword:[
						{ required: true, message: '请填写', },
					],
					newPassword: [
						{ required: true,  message: '请填写',}
					],
					rePassword: [
						{ required: true,  message: '请填写',}
					],
				}

			}
		},
		methods:{
			commitFun(name){
				this.$refs[name].validate((valid) => {
					if(valid){
						this.axios.request({
							url: '/supplier/user/pass/edit',
							method: 'post',
							data: this.fromPass
						}).then( (res) => {
							if(res.data.code=='0'){
								this.$Message.info('修改成功,请重新登录');
								this.$store.dispatch('logout');
								this.$router.push({
									path: '/login',
								})
							}
						})
					}
				});
			},
		}

	}
</script>

<style scoped>
.change-pass{
	/*padding: 10px;*/
}
</style>
