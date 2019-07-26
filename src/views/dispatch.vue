<template>
<div class="dispatch">
	<!--<div class="operate">-->
		<!---->
	<!--</div>-->
	<!--<Table border :columns="columns" :data="tableData"></Table>-->
	<common-table v-model="tableData" :columns="columns" :total="total"
	              @changePage="changePage" @changePageSize="changePageSize"
	              :page="page" class="table">
		<div slot="operate" style="margin-top: 5px">
			<Button type="primary">发货</Button>
			<span>2家门店</span>
		</div>
	</common-table>

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
			columns: [],
			tableData: [],
			page: 0,
			total: 0,
		}
	},
	mounted(){

	},
	methods:{
		getList(){

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
