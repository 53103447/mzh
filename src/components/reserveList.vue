<template>
<div>
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="1">
      房间号
    </el-col>
    <el-col :span="3">
      <el-input v-model="searchParam.roomNum" placeholder="请输入房间号" clearable size="small" @input="queryRserveInfo"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="1" style="margin-right: 8px">
      预订姓名
    </el-col>
    <el-col :span="3">
      <el-input v-model="searchParam.customerName" placeholder="请输入预订姓名" clearable size="small" @input="queryRserveInfo"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="1" style="margin-right: 8px">
      预订电话
    </el-col>
    <el-col :span="3">
      <el-input v-model="searchParam.reserveMobile" placeholder="请输入预订电话" clearable size="small" @input="queryRserveInfo"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="1" style="margin-right: 8px">
      状态
    </el-col>
    <el-col :span="3">
      <el-select v-model="searchParam.status" clearable placeholder="请选择" @change="queryRserveInfo">
        <el-option v-for="item in statusArr" :key="item.value" :label="item.key" :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="5"></el-col>
  </el-row>
  <el-divider></el-divider>
  <el-table :data="tableData" border style="width: 100%" size="small">
    <el-table-column prop="roomNum" label="房间号"></el-table-column>
    <el-table-column prop="customerName" label="预订姓名"> </el-table-column>
    <el-table-column prop="mobilePhone" label="预订电话"> </el-table-column>
    <el-table-column prop="reservePrice" label="订金金额"> </el-table-column>
    <el-table-column label="过期日期">
      <template slot-scope="scope">
        {{scope.row.effectiveTime | formatDate}}
      </template>
    </el-table-column>
    <el-table-column label="支付方式">
      <template slot-scope="scope">
        {{payType[scope.row.payType]}}
      </template>
    </el-table-column>
    <el-table-column label="预订日期">
      <template slot-scope="scope">
        {{scope.row.created | formatDate}}
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{status[scope.row.status]}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        {{scope.row.status==='3'}}
        <el-popconfirm title="确认启用该预订单吗？" @confirm="enableReserve(scope.row.id)" v-if="scope.row.status==='2'" >
          <el-button slot="reference" type="primary" size="mini" >启用</el-button>
        </el-popconfirm>
        <el-popconfirm title="确认作废该退款单吗？" @confirm="disableReserve(scope.row.id)" v-if="scope.row.status==='0'" >
          <el-button slot="reference" type="danger" size="mini" >作废</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-col type="flex" justify="center" align="middle" style="padding-top: 20px">
    <el-row :space="24">
      <el-pagination @size-change="pageSizeChange" @current-change="pageNoChange"
                     :current-page="searchParam.pageNo"
                     :page-sizes="[10, 30, 50, 100]"
                     :page-size="searchParam.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableTotalRecord">
      </el-pagination>
    </el-row>
  </el-col>
</div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "RentList",
    created() {
      this.queryRserveInfo()
    },
    data() {
      return {
        tableData:[],
        searchParam:{'pageNo':1,'pageSize':10},
        tableTotalRecord:0,
        status:{'0':'未使用','1':'已使用','2':'作废'},
        statusArr:[{'key': '未使用', 'value': '0'}, {'key': '已使用', 'value': '1'}, {'key': '作废','value': '2'}],
        payType: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金'}
      }
    },
    methods:{
      queryRserveInfo(){
        this.$http.post(pixUrl + '/reserve/selectAllByPage', this.searchParam).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.tableData = result.result
            this.tableTotalRecord = result.totalRecord
          }
        }, function () {
          console.log('查询缴费列表抵账！');
        });
      },
      pageSizeChange(val){
        this.searchParam.pageSize = val
        this.queryRentInfo()
      },
      pageNoChange(val){
        this.searchParam.pageNo = val
        this.queryRentInfo()
      },
      enableReserve(reserveId){
        this.$http.post(pixUrl + '/reserve/updateReserve', {'id':reserveId,'status':'0'}).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.queryRserveInfo()
          }
        }, function () {
          console.log('查询缴费列表抵账！');
        });
      },
      disableReserve(reserveId){
        this.$http.post(pixUrl + '/reserve/updateReserve', {'id':reserveId,'status':'2'}).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.queryRserveInfo()
          }
        }, function () {
          console.log('查询缴费列表抵账！');
        });
      }
    },
    filters: {
      formatDate: function (value) {
        if (typeof value == "undefined" || value == null || value == "") return ''
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + MM + "-" + d;
      }
    }
  }
</script>

<style scoped>

</style>
