<template>
<div class="dispatch">
	<!--<div class="operate">-->
		<!---->
	<!--</div>-->
	<!--<Table border :columns="columns" :data="tableData"></Table>-->
	<common-table v-model="tableData" :columns="columns" :total="total" :loading="loading"
	              @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick" ref="table"
	              :page="page" class="table">
		<div slot="operate" style="margin-top: 5px">
			<Button type="primary">发货</Button>
			<!--<span>2家门店</span>-->
			<Button type="info" @click="openGoods" :disabled="!detail.id">选择商品</Button>
		</div>
	</common-table>

	<Modal v-model="showGoods"
	       title="选择商品"
	       width="600"
	       class-name="dispatch-goods"
	       :scrollable="true"
	       :transfer= "true"
	       :mask-closable="false"
	       :transition-names="['', '']">
		<Form :label-width="100" ref="detail" :model="detail">
			<FormItem label="门店名称：">
				<span>{{detail.storeName}}</span>
			</FormItem>
			<FormItem label="门店地址：">
				<span>{{detail.storeAddr}}</span>
			</FormItem>
			<FormItem label="车型：">
				<span>{{detail.vehicleModel}}</span>
			</FormItem>
			<FormItem label="选择商品：">
				<!--<ul v-if="detail.goods">-->
				<li v-for="(item , key) in selGoods" :key="key">
					<Select placeholder="请选择" v-model="item.id" style="width: 300px" filterable label-in-value
					@on-change="chGoods">
						<Option v-for="(item2, key2) in goods" :key="key2" :value="item2.id">{{item2.ppName+item2.name+item2.lxName+item2.ndName+item2.djName+' '+item2.rlName}}</Option>
					</Select>
					<InputNumber  v-model="item.num" :min="1" :max="100" placeholder="数量"/>
					<span style="position: relative;left: -20px;">瓶</span>
					<Button type="default" icon="md-add" shape="circle" @click="goodsAdd"
					        v-show="selGoods.length==1"></Button>
					<Button type="default" icon="md-remove" shape="circle" @click="goodsMinus"
					        v-show="selGoods.length==2&&key==1"></Button>
				</li>
				<!--</ul>-->
			</FormItem>
			<FormItem label="推荐用量：">
				<span v-if="detailSuggest.length">{{detailSuggest[0].tjsyl+ detailSuggest[0].unit}}</span>
			</FormItem>
			<FormItem label="推荐机油：">
				<li v-for="(item, key) in detailSuggest" :key="key" style="width: 200px;display: inline-block">{{item.comment}}</li>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="closeDetail">取消</Button>
			<Button type="primary" @click="okGoods">确定</Button>
		</div>
	</Modal>
</div>
</template>

<script>
import CommonTable from '@/components/base-table.vue'
export default {
	name: "dispatch",
	components: {
		CommonTable,
	},
	data(){
		return{
			tableData: [],
			page: 1,
			limit: 10,
			total: 0,
			loading: true,
			showPost: false,
			showGoods: false,
			detail: {},
			selGoods: [],
			goods:[]
		}
	},
	computed:{
		columns(){
			return [
				{title: '门店名称', key: 'storeName', minWidth: 140},
				{title: '门店地址', key: 'storeAddr', minWidth: 140},
				{title: '车型', key: 'vehicleModel', minWidth: 140},
				{title: '品类', key: 'pls', minWidth: 80,
					render:(h,params) => h('span',  params.row.pls[0].name)},
				{title: '商品/预约数量（桶）', key: 'parts', minWidth: 230,
					render:(h,params) => {
						let arr= [], list= params.row.parts[params.row.pls[0].id].items
						list.map((item)=>{
							arr.push( h('li', `${item.name} * ${item.num}`) )
						})
						return arr.length? h('ul',  arr): h('span',  '未选择')
					}
				},
				{title: '推荐机油', key: 'parts', minWidth: 80, align: 'center',
					render:(h,params) =>{
						// console.log(params)
						let arr= [], list= params.row.parts[params.row.pls[0].id].comments, str=''
						list.map((item)=>{
							// arr.push( h('li',{style: 'padding-right:10px;width:200px;display:inline-block;'}, `${item.comment}`) )
							str+= ` ${item.comment} \n`
						})
						// return h('p',  arr)
						return h('Poptip',{
								props:{
									// title: '推荐机油',
									content: str,
									placement: "bottom-start",
									width: 220,
									trigger: 'hover',
									transfer: true,
									'word-wrap': true,
								}
							},
							[h('a', '查看')]
						)
					}},
				{title: '推荐使用量', key: 'parts', minWidth: 100,
					render:(h,params) =>{
						let str= params.row.parts[params.row.pls[0].id].comments[0]
						return h('span',  str.tjsyl+ str.unit)
					}},
				{title: '要求送达日期', key: 'requestDeliveryTime', minWidth: 120,},
			]
		},
		detailSuggest(){
			let arr= []
			if(this.detail.pls && this.detail.pls.length){
				arr= this.detail.parts[this.detail.pls[0].id].comments
			}
			return arr
		},
	},
	mounted(){
		this.getList()
		this.getGoods()
	},
	methods:{
		getList(){
			this.loading= true
			this.axios.post('/supplier/order/list',{
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
		getGoods(name){
			this.axios.post('/supplier/goods/list',{
				name: name|| '',
				pageNo: 1,
				pageSize: 1000,
			}).then( (res) => {
				if(res.data.code=='0'){
					// res.data.items.map((item)=>{
					// 	this.goods.push({id: item.id, label: })
					// })
					this.goods= res.data.items
				}
			})
		},
		onRowClick(row){
			this.detail= row
		},
		openGoods(){
			this.showGoods= true
			this.setGoods()
		},
		setGoods(){
			if(this.detail.pls && this.detail.pls.length){
				this.selGoods= this.detail.parts[this.detail.pls[0].id].items
			}
			if(!this.selGoods.length){
				this.selGoods= [{id: null, num: null}]
			}
		},
		goodsAdd(){
			this.selGoods.push({id: null, num: null})
		},
		goodsMinus(){
			this.selGoods.pop()
		},
		chGoods(val){
			console.log(val)
		},
		okGoods(){

		},
		closeDetail(){
			this.$refs.table.clearCurrentRow()
			this.$refs.detail.resetFields()
			this.showPost= false
			this.showGoods= false
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
.dispatch{
	.operate{
		padding-top: 5px;
	}

}
</style>

<style lang="less">
.dispatch-goods{
	.ivu-modal-body{
		max-height: 70vh;
		overflow: auto;
	}
}
</style>
