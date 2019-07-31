<template>
<div class="supplier-manage">
	<Form :label-width="60" class="common-form" style="padding-left: 10px">
		<FormItem label="名称:">
			<Input v-model="query.name" clearable/>
		</FormItem>
		<FormItem label="简称:">
			<Input v-model="query.shortName" clearable/>
		</FormItem>
		<FormItem label="状态">
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
	              @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
	              ref="table" class="table">
		<div slot="operate">
			<Button type="primary" @click="clickCreate">新增</Button>
			<Button type="info" :disabled="!detail.id" @click="showDetail= true">查看/编辑</Button>
			<Button :type="isDisabled? 'success': 'error'" @click="clickStatus"
			        :disabled="!detail.id">{{isDisabled? '启用' : '禁用'}}</Button>
		</div>
	</common-table>

	<Modal v-model="showDetail"
	       title="供应商"
	       width="400"
	       @on-cancel="closeDetail"
	       :scrollable="true"
	       :transfer= "true"
	       :mask-closable="false"
	       :transition-names="['', '']">
		<Form :label-width="80" ref="detail" :rules="rules"  :model="detail">
			<FormItem label="名称：" prop="name">
				<Input type="text" v-model="detail.name" placeholder="请输入" clearable></Input>
			</FormItem>
			<FormItem label="简称：" prop="shortName">
				<Input type="text" v-model="detail.shortName" placeholder="请输入" clearable></Input>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="closeDetail">取消</Button>
			<Button type="primary" @click="ok">{{isEdit?'修改':'新增'}}</Button>
		</div>
	</Modal>
</div>
</template>

<script>
import CommonTable from '@/components/base-table.vue'
import {deepClone} from '@/util'
let detailInit={
	name: '',
	shortName: '',
}
export default {
	name: "supplier-manage",
	components: {
		CommonTable,
	},
	data(){
		let rule= {required:true,message:'必填项不能为空'}
		return{
			query: {
				name: '',
				shortName: '',
				disabled: null,
			},
			tableData: [],
			columns: [
				{title: 'id', key: 'id', width: 70},
				{title: '名称', key: 'name', minWidth: 120,},
				{title: '简称', key: 'shortName', minWidth: 100,},
				{title: '状态', key: 'disabled', width: 80,
					render:(h,params) => h('span', params.row.disabled? '禁用': '可用')
				}
			],
			page: 1,
			limit: 10,
			total: 0,
			loading: true,
			showDetail: false,
			detail: deepClone(detailInit),
			rules: {
				name: rule,
				shortName: rule,
			},
		}
	},
	computed:{
		isEdit(){
			return !!this.detail.id
		},
		isDisabled(){
			return this.detail.disabled
		}
	},
	mounted(){
		this.getList()
	},
	methods:{
		getList(){
			this.loading= true
			this.axios.post('/supplier/list',{
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
		clickCreate(){
			this.showDetail= true
			this.detail= deepClone(detailInit)
		},
		clickStatus(){
			let url= '/supplier/disabled/', ope= '禁用'
			if(this.isDisabled){
				url= '/supplier/enable/'
				ope= '启用'
			}
			this.$Modal.confirm({
				title: `确定${ope}（${this.detail.name}）？`,
				onOk:()=>{
					this.axios.post(url+ this.detail.id).then( (res) => {
						// console.log(res)
						if(res.data.code=='0'){
							this.$Message.success( ope+"成功");
							this.getList()
							this.closeDetail()
						}
					})
				}
			})
		},
		ok(){
			this.$refs.detail.validate(validator=>{
				if(validator){
					let url= '/supplier/add'
					if(this.isEdit){
						url= '/supplier/edit'
					}
					this.axios.post(url, this.detail).then( (res) => {
						if(res.data.code=='0'){
							this.$Message.success( (this.isEdit?'修改':'新增')+ "成功");
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
			this.detail= deepClone(detailInit)
		},
		onRowClick(row){
			this.detail= row
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

<style scoped lang="less">
.supplier-manage{

}
</style>
