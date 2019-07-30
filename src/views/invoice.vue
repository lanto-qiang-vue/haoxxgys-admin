<template>
<div class="invoice">
	<Form :label-width="80" class="common-form" style="padding-left: 10px">
		<FormItem label="门店名称:">
			<Input v-model="query.storeName" clearable/>
		</FormItem>
		<FormItem v-for="(item, key) in detailOption" :key="key"
		          :label="item.name+':'" :prop="key">
			<Select placeholder="请选择" v-model="query[key]" clearable transfer >
				<Option v-for="(item2, index2) in item.data" :key="index2"
				        :value="item2.id">{{item2.name}}</Option>
			</Select>
		</FormItem>
		<FormItem label="发货日期:">
			<DatePicker type="daterange" format="yyyy-MM-dd" placeholder="请选择" transfer clearable
			            @on-change="changeDate" style="width: 100%"></DatePicker>
		</FormItem>
		<FormItem>
			<Button type="primary" @click="page=1;getList()">搜索</Button>
		</FormItem>
	</Form>
	<common-table v-model="tableData" :columns="columns" :total="total" ref="table"
	              @changePage="changePage" @changePageSize="changePageSize"
	              :page="page" :loading="loading" class="table">
	</common-table>
	<ul>
		<li v-for="(item, key) in goods" :key="key">{{`${item.fullName },总发货量：${item.num}`}}</li>
	</ul>
</div>
</template>

<script>
import CommonTable from '@/components/base-table.vue'
export default {
	name: "invoice",
	components: {
		CommonTable,
	},
	data(){
		return{
			query: {
				storeName: '',
				"dj": null,
				"nd": null,
				"pp": null,
				"rl": null,
				startDate: null,
				endDate: null,
			},
			detailOption: {
				"pp": {id: 38, name:'品牌', data: []},
				"nd": {id: 39, name:'粘度', data: []},
				"rl": {id: 40, name:'容量', data: []},
				"dj": {id: 42, name:'等级', data: []},
			},
			tableData:[],
			total: 0,
			page: 1,
			limit: 10,
			loading: true,
			goods:[]
		}
	},
	computed:{
		columns(){
			return [
				{title: '门店名称', key: 'storeName', minWidth: 140},
				{title: '门店地址', key: 'storeAddr', minWidth: 140},
				{title: '机油 [品牌 品名 等级 粘度 容量 分类 数量(桶)]', key: 'items', minWidth: 330,
					render:(h,params) => {
						let arr= [], list= params.row.items
						list.map((item)=>{
							arr.push( h('li', `${item.goodsDesc} * ${item.goodsNum}`) )
						})
						return  h('ul',  arr)
					}},
				{title: '确认发货时间', key: 'createTime', minWidth: 110},
				{title: '要求送达日期', key: 'requestDeliveryTime', minWidth: 110},
				{title: '门店入库时间', key: 'storeReceiptTime', minWidth: 110},
			]
		}
	},
	mounted(){
		this.getDict()
		this.getList()
		this.getGoods()
	},
	methods:{
		changePage(page){
			this.page= page
			this.getList()
		},
		changePageSize(size){
			this.limit= size
			this.getList()
		},
		getList(){
			this.loading= true
			this.axios.post('/supplier/invoice/list',{
				"pageNo": this.page,
				"pageSize": this.limit,
				...this.query
			}).then( (res) => {
				this.loading= false
				if(res.data.code=='0'){
					this.tableData= res.data.items
					this.total= res.data.total
				}
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
		getGoods(){
			this.axios.get('/supplier/invoice/stat').then( (res) => {
				if(res.data.code=='0'){
					this.goods= res.data.items
				}
			})
		},
		changeDate(val){
			// console.log('changeGiveValidDate', val)
			this.query.startDate= val[0]
			this.query.endDate= val[1]
		}
	}
}
</script>

<style scoped lang="less">

</style>
