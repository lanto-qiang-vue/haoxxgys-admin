<template>
<div class="goods">
	<common-table v-model="tableData" :columns="columns" :total="total" ref="table"
	              @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
	              :page="page" :loading="loading" class="table">
		<div slot="operate">
			<Button type="primary" @click="clickCreate">新增商品</Button>
			<Button type="info" :disabled="!detail.id" @click="showDetail= true">查看/编辑</Button>
		</div>
	</common-table>
	<Modal v-model="showDetail"
			title="商品详情"
			width="500"
	       @on-cancel="closeDetail"
			:scrollable="true"
			:transfer= "true"
			:footer-hide="false"
			:mask-closable="false"
			:transition-names="['', '']">
		<Form :label-width="100" ref="detail" :rules="rules"  :model="detail" style="width: 350px">
			<FormItem label="品名：" prop="name">
				<Input type="text" v-model="detail.name" placeholder="请输入" clearable></Input>
			</FormItem>
			<FormItem v-for="(item, key) in detailOption" :key="key"
					:label="item.name+'：'" :prop="key">
				<Select placeholder="请选择" v-model="detail[key]" clearable transfer >
					<Option v-for="(item2, index2) in item.data" :key="index2"
					        :value="item2.id">{{item2.name}}</Option>
				</Select>
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
	"name": "",
	"dj": null,
	"id": null,
	"lx": null,
	"nd": null,
	"pl": null,
	"pp": null,
	"rl": null,
}
export default {
	name: "goods",
	components: {
		CommonTable,
	},
	data(){
		return{
			columns: [
				{title: '商品编号', key: 'id', minWidth: 80},
				{title: '品类', key: 'plName', minWidth: 80,},
				{title: '品牌', key: 'ppName', minWidth: 80,},
				{title: '品名', key: 'name', minWidth: 150},
				{title: '粘度', key: 'ndName', minWidth: 80},
				{title: '容量', key: 'rlName', minWidth: 80},
				{title: '分类', key: 'lxName', minWidth: 100},
				{title: '等级', key: 'djName', minWidth: 80},
			],
			tableData: [],
			page: 1,
			limit: 10,
			total: 0,
			detail: deepClone(detailInit),
			loading: true,
			showDetail: false,
			detailOption: {
				"pl": {id: 37, name:'品类', data: []},
				"pp": {id: 38, name:'品牌', data: []},
				"nd": {id: 39, name:'粘度', data: []},
				"rl": {id: 40, name:'容量', data: []},
				"lx": {id: 41, name:'类型', data: []},
				"dj": {id: 42, name:'等级', data: []},
			}
		}
	},
	computed:{
		isEdit(){
			return !!this.detail.id
		},
		rules(){
			let obj= {}
			for(let key in detailInit){
				obj[key]= {required:true,message:'必填项不能为空'}
			}
			return obj
		}
	},
	mounted(){
		this.getList()
		this.getDict()
	},
	methods:{
		getList(){
			this.loading= true
			this.axios.post('/supplier/goods/list',{
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
		getDict(){
			for(let key in this.detailOption){
				let item= this.detailOption[key]
				this.axios.get('/dict/getValuesByTypeId/'+ item.id).then( (res) => {
					if(res.data.code=='0'){
						let arr= res.data.items
						item.data= arr
						// if(arr.length==1){
						// 	this.detail[key]= arr[0].id
						// }
						// this.detailOption[key].data= res.data.items
					}
				})
			}
		},
		ok(){
			this.$refs.detail.validate(validator=>{
				if(validator){
					let url= '/supplier/goods/add'
					if(this.isEdit){
						url= '/supplier/goods/edit'
					}
					this.axios.post(url, this.detail).then( (res) => {
						if(res.data.code=='0'){
							this.$Message.success( (this.isEdit?'修改':'新建')+ "成功");
							this.getList()
							this.closeDetail()
						}
					})
				}
			})
		},
		clickCreate(){
			this.detail= deepClone(detailInit)
			setTimeout(()=>{
				this.$refs.detail.resetFields()
				setTimeout(()=>{
					this.showDetail= true
				},0)
			},10)

		},
		closeDetail(){
			this.$refs.table.clearCurrentRow()
			this.$refs.detail.resetFields()
			this.showDetail= false
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

</style>
