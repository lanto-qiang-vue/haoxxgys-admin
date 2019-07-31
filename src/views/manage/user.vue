<template>
<div class="user-manage">
	<Form :label-width="90" class="common-form">
		<FormItem label="账号:">
			<Input v-model="query.name" clearable/>
		</FormItem>
		<FormItem label="昵称:">
			<Input v-model="query.shortName" clearable/>
		</FormItem>
		<FormItem label="供应商:">
			<Select placeholder="请选择" v-model="query.supplierId" clearable transfer filterable >
				<Option v-for="(item, key) in supplierList" :key="key"
						:value="item.id">{{item.name}}</Option>
			</Select>
		</FormItem>
		<FormItem label="状态:">
			<Select placeholder="请选择" v-model="query.disabled" clearable transfer >
				<Option value="false">可用</Option>
				<Option value="true">禁用</Option>
			</Select>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="page=1;getList()">搜索</Button>
		</FormItem>
	</Form>
	<common-table v-model="tableData" :columns="columns" :total="total"  :page="page" :loading="loading"
	              @changePage="changePage" @changePageSize="changePageSize"
	              ref="table" class="table">
		<div slot="operate">
			<Button type="success" @click="clickCreate">新增</Button>
		</div>
	</common-table>

	<Modal v-model="showDetail"
	       title="新增用户"
	       width="400"
	       :scrollable="true"
	       :transfer= "true"
	       :mask-closable="false"
	       :transition-names="['', '']">
		<Form :label-width="80" ref="detail" :rules="rules"  :model="detail">
			<FormItem label="账号：" prop="account">
				<Input type="text" v-model="detail.account" placeholder="请输入" :maxlength="11" clearable></Input>
			</FormItem>
			<FormItem label="昵称：" prop="nickname">
				<Input type="text" v-model="detail.nickname" placeholder="请输入" clearable></Input>
			</FormItem>
			<FormItem label="供应商：" prop="supplierId">
				<Select placeholder="请选择" v-model="detail.supplierId" clearable transfer filterable>
					<Option v-for="(item, key) in supplierList" :key="key"
					        :value="item.id">{{item.name}}</Option>
				</Select>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="closeDetail">取消</Button>
			<Button type="success" @click="ok">新增</Button>
		</div>
	</Modal>
</div>
</template>

<script>
import CommonTable from '@/components/base-table.vue'
import {deepClone, reg} from '@/util'
let detailInit={
	account: '',
	nickname: '',
	supplierId: null
}
export default {
	name: "user-manage",
	components: {
		CommonTable,
	},
	data(){
		let rule= {required:true,message:'必填项不能为空'}
		return{
			query: {
				account: '',
				nickname: '',
				supplierId: null,
				disabled: null,
			},
			tableData: [],
			columns: [
				{title: '账号', key: 'account', width: 150},
				{title: '昵称', key: 'nickname', minWidth: 150,},
				{title: '供应商', key: 'supplier', minWidth: 200,
					render:(h,params) => h('span', params.row.supplier.name)
				},
				{title: '状态', key: 'disabled', width: 80,
					render:(h,params) => h('span', params.row.disabled? '禁用': '可用')
				}
			],
			supplierList: [],
			page: 1,
			limit: 10,
			total: 0,
			loading: true,
			showDetail: false,
			detail: deepClone(detailInit),
			rules: {
				account: [rule,{
					validator: (rule, value, callback) => {
						if (reg.mobile.test(value)) {
							return callback();
						}else{
							return callback(new Error('请填写正确的手机号'));
						}
					}
				}],
				nickname: rule,
				supplierId: rule,
			},
		}
	},
	mounted(){
		this.getList()
		this.getSupplier()
	},
	methods:{
		getList(){
			this.loading= true
			this.axios.post('/supplier/user/list',{
				...this.query,
				pageNo: this.page,
				pageSize: this.limit,
			}).then( (res) => {
				if(res.data.code=='0'){
					this.tableData= res.data.items
					this.total= res.data.total
				}
				this.loading= false
			})
		},
		getSupplier(){
			this.axios.post('/supplier/list',{
				pageNo: 1,
				pageSize: 1000,
			}).then( (res) => {
				if(res.data.code=='0'){
					this.supplierList= res.data.items
				}
			})
		},
		clickCreate(){
			this.showDetail= true
			this.detail= deepClone(detailInit)
		},
		ok(){
			this.$refs.detail.validate(validator=>{
				if(validator){
					this.axios.post('/supplier/user/add', this.detail).then( (res) => {
						if(res.data.code=='0'){
							this.$Message.success("新增成功");
							this.closeDetail()
							this.getList()
						}
					})
				}
			})
		},
		closeDetail(){
			this.$refs.table.clearCurrentRow()
			this.$refs.detail.resetFields()
			this.showDetail= false
		},
		changePage(page){
			this.page= page
			this.getList()
		},
		changePageSize(size){
			this.limit= size
			this.getList()
		},
	}
}
</script>

<style scoped>

</style>
