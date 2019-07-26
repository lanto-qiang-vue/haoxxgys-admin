<template>
<div class="login">
<div class="center">
	<h1><img src="~@/assets/img/hoxiuxiu-logo.png"/>供应商后台系统</h1>
	<div class="input-box">
		<Tabs v-model="type">
			<TabPane label="验证码登录" name="SMS">
				<Form ref="phone" :rules="rulePhone"  :model="formPhone"  @keydown.enter.native="toLogin()">
					<FormItem prop="account">
						<Input v-model="formPhone.account" :maxlength="11" size="large" placeholder="请输入手机号">
						<span slot="prepend">
	                  <Icon :size="16" type="ios-person"></Icon>
	                </span>
						</Input>
					</FormItem>
					<FormItem prop="captcha" class="pass">
						<Input v-model="formPhone.pass" placeholder="请输入验证码" size="large">
						<span slot="prepend">
	                      <Icon :size="14" type="md-lock"></Icon>
	                    </span>
						</Input>
						<countdown class="get-code" text="获取验证码" ref="countdown"
						           :phone="formPhone.account" @click="getCode"
						           :url="'/supplier/user/sms/'+formPhone.account"></countdown>
					</FormItem>
				</Form>
			</TabPane>
			<TabPane label="密码登录" name="PASS">
				<Form ref="pass" :rules="rulePass" :model="formPass" @keydown.enter.native="toLogin()">
					<FormItem prop="account">
						<Input v-model="formPass.account" size="large" placeholder="请输入用户名">
						<span slot="prepend">
	                  <Icon :size="16" type="ios-person"></Icon>
	                </span>
					</Input>
					</FormItem>
					<FormItem prop="pass">
						<Input type="password" v-model="formPass.pass" size="large" placeholder="请输入密码">
						<span slot="prepend">
	                  <Icon :size="14" type="md-lock"></Icon>
	                </span>
						</Input>
						<!--<a class="forget" @click="resetFun">忘记密码？</a>-->
					</FormItem>
				</Form>

			</TabPane>
		</Tabs>
		<Button type="primary" long size="large" @click="toLogin()">{{type=='SMS'?'验证并登录':'登录'}}</Button>
	</div>

<Modal
    v-model="showFind"
    title="重置密码"
    width="350px"
    @on-visible-change=""
    :footer-hide="true"
    class=""
    :mask-closable="false"
  >
  	<div class="reset-box">
		<Form ref="reset" :rules="ruleReset" :model="formReset">
			<FormItem prop="mobileNo">
				<Input v-model="formReset.mobileNo" :maxlength="11" placeholder="请输入手机号">
					<span slot="prepend"><Icon :size="16" type="ios-person"></Icon></span>
				</Input>
			</FormItem>
			<FormItem prop="smsCode" class="captcha">
				<Input v-model="formReset.smsCode" placeholder="请输入验证码" size="large">
				<span slot="prepend">
					<Icon :size="14" type="md-lock"></Icon>
				</span>
				</Input>
				<countdown class="get-code" text="获取验证码" ref="countdown"
							:phone="formReset.mobileNo" @click="getCode" url="/hxxdc/insurance/sms/send/reset"></countdown>
			</FormItem>
			<FormItem prop="password">
				<Input type="password" v-model="formReset.password" size="large" placeholder="请输入密码">
					<span slot="prepend"><Icon :size="14" type="md-lock"></Icon></span>
				</Input>
			</FormItem>
			<FormItem prop="rePassword">
				<Input type="password" v-model="formReset.rePassword" size="large" placeholder="请确认密码">
					<span slot="prepend"><Icon :size="14" type="md-lock"></Icon></span>
				</Input>
			</FormItem>
			<FormItem style="margin-bottom: 10px">
				<Button type="primary" long @click="toReset">重置密码</Button>
			</FormItem>
		</Form>
	</div>
  </Modal>

</div>
<foot></foot>
</div>
</template>

<script>
import Countdown from '@/components/countdown-button.vue'
import Foot from '@/components/Footer.vue'
export default {
	name: "login",
	components: {Countdown, Foot},
	data(){
		return{
			type: 'SMS',
			showFind:false,
			formPhone: {
				account:'',
				pass:''
			},
			formPass: {
				account:'',
				pass:''
			},
			formReset:{
				"mobileNo": "",
				"password": "",
				"rePassword": "",
				"smsCode": ""
			},
			rulePhone: {
				account:[
					{ required: true, message: '请输入手机号码', },
				],
				pass: [
					{ required: true,  message: '请填写验证码',}
				],
			},//规则验证
			rulePass: {
				account:[
					{ required: true, message: '请输入用户名', },
				],
				pass: [
					{ required: true,  message: '请填写密码',}
				],
			},//规则验证
			ruleReset: {
				mobileNo:[
					{ required: true, message: '请输入手机号码', },
				],
				smsCode:[{ required: true,  message: '请填写验证码',}],
				password:[{ required: true,  message: '请输入密码',}],
				rePassword:[{ required: true,  message: '请输入密码',}],
			},

		}
	},
	methods:{
		toLogin(type){
			let url = '', data = {}
			if (this.type == 'SMS') {
				data = {
					loginType: this.type,
					...this.formPhone
				}
				this.$refs.phone.validate((valid) => {
					if (valid) {
						this.toRequest(data);
					}
				})
			}else{
				data = {
					loginType: this.type,
					...this.formPass
				}
				this.$refs.pass.validate((valid) => {
					if (valid) {
						this.toRequest(data);
					}
				})
			}
		},
		toRequest(data){
			this.$Spin.show();
			this.axios.post('/supplier/user/login', data).then(res => {
				if (res.data.code=="0") {
					this.$store.dispatch('login', res.data);
					this.goBackUrl()
					this.$Message.success('登录成功')
				}
				this.$Spin.hide()
			})
		},
		getCode(code){

		},
		resetFun(){
			this.showFind= true;
			this.$refs.reset.resetFields();
		},
		toReset(){
			this.$refs.reset.validate((valid) => {
				if (valid) {
					this.axios.request({
						url: '/hxxdc/insurance/user/forget/password',
						method: 'post',
						data: this.formReset
					}).then(res => {
						if (res.data.code=="0") {
							this.$Message.success('重置成功');
                			this.showFind= false;
						}
					})
				}
			})
		},
		goBackUrl(){
			let redirect= this.$route.query.redirect
			if(redirect){
				this.$router.replace({path: redirect})
			}else{
				this.$router.replace({path: '/dispatch'})
			}
		},
	}
}
</script>

<style scoped lang="less">
.login{
	height: 100vh;
	min-height: 800px!important;
	border-bottom: 60px solid white;
	position: relative;
	background:linear-gradient(180deg,rgba(0,206,246,0) 30%,rgba(201,243,252,0) 55%,rgba(104,205,251,1) 100%);
	.center{
		width: 500px;
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		>h1{
			font-size: 30px;
			font-weight: 400;
			margin-bottom: 55px;
			text-align: center;
			img{
				height: 50px;
				margin-right: 20px;
				vertical-align: text-bottom;
			}
		}
		.input-box{
			padding: 50px 90px;
			box-shadow:0 6px 9px 0 rgba(0,0,0,0.08);
			border-radius:5px;
			border:1px solid rgba(231,231,231,0.62);
			background-color: white;
			.get-code{
				z-index: 999;
				width: 90px;
				line-height: 34px;
				text-align: center;
				position: absolute;
				top: 2px;
				right: 1px;
				background-color: #ECF5FF;
				border-radius: 2px;
				/*border: 1px solid #B3D8FF;*/
				color: #1890FF;
				cursor: pointer;
				&.off{
					border-left: 1px solid #dcdee2;
					background-color: white;
					color: #777777;
					cursor: default;
				}
			}
			.forget{
				position: absolute;
				right: 0;
				bottom: -35px;
				color: #6E7F94;
				font-size: 12px;
			}
		}
	}
	.footer{
		position: absolute;
		left: 0;
		bottom: -60px;
		width: 100%;
	}
}
.reset-box{
	.get-code{
				width: 90px;
				line-height: 34px;
				text-align: center;
				position: absolute;
				top: 0;
				right: 0;
				background-color: #ECF5FF;
				border-radius: 2px;
				border: 1px solid #B3D8FF;
				color: #1890FF;
				cursor: pointer;
				&.off{
					border: 1px solid #dcdee2;
					background-color: white;
					color: #777777;
					cursor: default;
				}
			}
			.forget{
				position: absolute;
				right: 0;
				bottom: -35px;
				color: #6E7F94;
				font-size: 12px;
			}
}
</style>
<style lang="less">
.login{
	.ivu-tabs-bar{
		border: 0;
	}
	.ivu-tabs-nav-scroll{
		text-align: center;
		.ivu-tabs-nav{
			float: none;
			display: inline-block;
		}
	}
	.input-box{
		.captcha .ivu-form-item-content{
			padding-right: 100px;
		}
	}
	form{
		margin: 30px 0 40px;
	}
}
.reset-box{
.captcha .ivu-form-item-content{
			padding-right: 100px;
		}
}
</style>
