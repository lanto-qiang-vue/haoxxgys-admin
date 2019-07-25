<template>
<div class="compare">
	<common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize"
                :show="showTable" :page="page" :loading="loading" class="table">
    <div slot="operate">
		<Form :label-width="130" class="common-form left" style="display: inline-block;">
			<FormItem label="车牌号码/VIN：">
				<Input v-model="searchList.vehicleInfo"  size="large" placeholder="车牌号码/VIN"></Input>
			</FormItem>
			<FormItem label="出险日期：">
				<DatePicker type="date" placeholder="请选择" @on-change="changeTime"></DatePicker>
			</FormItem>
			<FormItem label="结案日期：">
				<DatePicker type="date" placeholder="请选择" @on-change="changeTime1"></DatePicker>
			</FormItem>
			<FormItem label="对比日期：">
				<DatePicker type="date" placeholder="请选择" @on-change="changeTime2"></DatePicker>
			</FormItem>
			<FormItem style="width: 80px;" :label-width="0">
				<Button type="primary" v-if="" @click="page=1,getList()">查询</Button>
			</FormItem>
		</Form>
		<div class="right">
			<Button type="primary" v-if="" @click="type=Math.random();">批量导入</Button>
			<Button type="primary" v-if="" @click="exportBut">下载报表</Button>
		</div>
	    <Button type="primary" v-if="" class="to-compare" @click="handleSubmit">确定对比</Button>
    </div>
	<upload-excel :type="type" :actionUrl="'/proxy/hxxdc/insurance/claims/import'" :title="'导入文件'" @closeFile="closeFile"></upload-excel>
  </common-table>
</div>
</template>

<script>
import CommonTable from '@/components/base-table.vue'
import uploadExcel from '@/components/upload-excel.vue'
export default {
	name: "compare",
	components: {
		CommonTable,
		uploadExcel
	},
	data(){
	  return{
		  type:null,
		columns:[
			{title: '车牌号码', key: 'vehiclePlateNumber', minWidth: 120,
				renderHeader:(h,params)=>{
					return h('div',[
						h('span','车牌号码'),
						h('span',{
							style:{
								lineHeight: "1",
								fontSize: "16px",
								color: "#ed4014",
								paddingLeft:'2px'
							}
						},'*')
					])
				},
				render: (h, params) => {
					if(params.index==0){
						return h('div', [
							h('Input', {
								props: {
									value: this.confirmData.vehiclePlateNumber,
									placeholder:'必填项'
								},
								on: {
									"on-change":(event)=>{
										this.confirmData.vehiclePlateNumber=event.target.value;
									},
								}
							})
						]);
					}else{
						return h('div', [
							h('span', params.row.vehiclePlateNumber)
						]);
					}
				}
			},
			{title: '车辆识别号VIN', key: 'vin', minWidth: 130,
				renderHeader:(h,params)=>{
					return h('div',[
						h('span','车辆识别号VIN'),
						h('span',{
							style:{
								lineHeight: "1",
								fontSize: "16px",
								color: "#ed4014",
								paddingLeft:'2px'
							}
						},'*')
					])
				},
				render: (h, params) => {
					if(params.index==0){
						return h('div', [
							h('Input', {
								props: {
									value: this.confirmData.vin,
									placeholder:'必填项'
								},
								on: {
									"on-change":(event)=>{
										this.confirmData.vin=event.target.value;
									},
								}
							})
						]);
					}else{
						return h('div', [
							h('span', params.row.vin)
						]);
					}
				}
			},
			{title: '出险日期', key: 'insuranceTime', minWidth: 140,
				renderHeader:(h,params)=>{
					return h('div',[
						h('span','出险日期'),
						h('span',{
							style:{
								lineHeight: "1",
								fontSize: "16px",
								color: "#ed4014",
								paddingLeft:'2px'
							}
						},'*')
					])
				},
				render: (h, params) => {
					if(params.index==0){
						return h('div', [
							h('DatePicker', {
								props: {
									value: this.confirmData.insuranceTime,
									placeholder:'必填项',
									transfer: true,
								},
								on: {
									"on-change":(event)=>{
										this.confirmData.insuranceTime=event;
									},
								}
							})
						]);
					}else{
						return h('div', [
							h('span', params.row.insuranceTime)
						]);
					}
				}
			},
			{title: '结案日期', key: 'closeTime', minWidth: 140,
				renderHeader:(h,params)=>{
					return h('div',[
						h('span','结案日期'),
						h('span',{
							style:{
								lineHeight: "1",
								fontSize: "16px",
								color: "#ed4014",
								paddingLeft:'2px'
							}
						},'*')
					])
				},
				render: (h, params) => {
					if(params.index==0){
						return h('div', [
							h('DatePicker', {
								props: {
									value: this.confirmData.closeTime,
									placeholder:'必填项',
									transfer: true,
								},
								on: {
									"on-change":(event)=>{
										this.confirmData.closeTime=event;
									},
								}
							})
						]);
					}else{
						return h('div', [
							h('span', params.row.closeTime)
						]);
					}
				}
			},
			{title: '开票企业名称', key: 'invoiceCompanyName', minWidth: 150,
				render: (h, params) => {
					if(params.index==0){
						return h('div', [
							h('Input', {
								props: {
									value: this.confirmData.invoiceCompanyName,
									placeholder:'非必填项'
								},
								on: {
									"on-change":(event)=>{
										this.confirmData.invoiceCompanyName=event.target.value;
									},
								}
							})
						]);
					}else{
						return h('div', [
							h('span', params.row.invoiceCompanyName)
						]);
					}
				}
			},
			{title: '理赔项目', key: 'claimsItem', minWidth: 150,
				render: (h, params) => {
					if(params.index==0){
						return h('div', [
							h('Input', {
								props: {
									value: this.confirmData.claimsItem,
									placeholder:'非必填项'
								},
								on: {
									"on-change":(event)=>{
										this.confirmData.claimsItem=event.target.value;
									},
								}
							})
						]);
					}else{
						return h('div', [
							h('span', params.row.claimsItem)
						]);
					}
				}
			},
			{title: '维修企业名称', key: 'repairCompanyName', minWidth: 120,},
			{title: '送修日期', key: 'repairTime', minWidth: 120,},
			{title: '结算日期', key: 'settlementTime', minWidth: 120,},
			{title: '故障描述', key: 'faultInfo', minWidth: 120,},
			{title: '比对日期', key: 'comparisonTime', minWidth: 120,},
			{title: '查询车牌结果', key: 'searchVehiclePlateNumber', minWidth: 120,},
			{title: '查询VIN码结果', key: 'searchVin', minWidth: 120,}

		],
		tableData: [{}],
		searchList:{
			"closeTime": "",
			"comparisonTime": "",
			"insuranceTime": "",
			"pageNo": 0,
			"pageSize": 10,
			"vehicleInfo": ""
		},
		confirmData:{
			"claimsItem": "",
			"closeTime": "",
			"insuranceTime": "",
			"invoiceCompanyName": "",
			"vehiclePlateNumber": "",
			"vin": ""
		},
		page: 1,
		limit: 10,
		total: 0,
		showTable:false,
		showDetail: false,
		detailData: null,
		clearTableSelect: null,
		loading:false
	}
	},
	mounted () {
      this.getList();
    },
    methods:{
        getList(){
            this.loading=true;
			this.searchList['pageNo']=this.page;
			this.searchList['pageSize']=this.limit;
            this.axios.request({
				url: '/hxxdc/insurance/claims/list',
				method: 'post',
				data: this.searchList
			}).then( (res) => {
              if(res.data.code=="0"){
                  this.tableData=res.data.items;
				  this.tableData.unshift({});
                  this.total=res.data.total;
                  this.loading=false;
              }else{
                this.loading=false;
              }
            })
        },
        changePage(page){
          this.page= page
          this.getList()
        },
        changePageSize(size){
          this.limit= size
          this.getList()
        },
		changeTime(time){
			this.searchList.insuranceTime=time;
		},
		changeTime1(time){
			this.searchList.closeTime=time;
		},
		changeTime2(time){
			this.searchList.comparisonTime=time;
		},
		handleSubmit(){
			this.axios.request({
				url: '/hxxdc/insurance/claims/comparison',
				method: 'post',
				data: this.confirmData
			}).then( (res) => {
              if(res.data.code=="0"){
				  for(let i in this.confirmData){
					  this.confirmData[i]='';
				  }
				  if(res.data.value){
					  this.$Message.warning({content: res.data.value})
				  }
				  this.page= 1;
                  this.getList();
              }
            })
		},
		exportBut(){
          this.$Modal.confirm({
              title:"系统提示!",
              content:"确定要导出吗？",
              onOk:this.exportFun,

          })

        },
        exportFun(){
			this.axios.request({
				url: '/hxxdc/insurance/claims/export',
				method: 'post',
				data: this.searchList,
				responseType: 'arraybuffer'
			}).then( (res) => {
            let headerData=res.headers["content-disposition"].split(';')[1].split('=');
                let headerName=headerData[1].substring(1,(headerData[1].length)-1)
                console.log(headerData,headerName);


                let blob = new Blob([res.data], {type: 'application/octet-stream'});

                // console.log(blob);
                let a = document.createElement('a');
                a.download = headerName;

                a.href = window.URL.createObjectURL(blob);
                $("body").append(a);
                a.click();
                $(a).remove();

          })
        },
		closeFile(){
			this.getList();
		}
    },
}
</script>

<style scoped lang="less">
.compare{
	padding-left: 100px;
	.table{
		overflow: visible;
		.left{
			/*padding-top: 0;*/
			padding-right: 200px;
		}
		.right{
			position: absolute;
			right: 10px;
			bottom: 10px;
		}
		.to-compare{
			position: absolute;
			bottom: -85px;
			left: -100px;
		}
	}

}
</style>
