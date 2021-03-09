<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        房间号
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.roomNum" placeholder="房间号" clearable size="small" @input="inputTimeOut"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        销售员：
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.saleId" clearable placeholder="销售员" @change="queryCommissionList">
          <el-option v-for="item in saleUser" :key="item.id" :label="item.userName"
                     :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        结算状态
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.status" clearable placeholder="请选择" @change="queryCommissionList">
          <el-option v-for="item in commissionStatusArr" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" border :row-class-name="tableRowClassName"  @sort-change="sortChange" header-row-class-name="headerClass" style="width: 100%">
      <el-table-column label="合同起期" prop="contractStart" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.contractStart | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="roomNum" label="房间号"></el-table-column>
      <el-table-column prop="saleName" label="销售员"></el-table-column>
      <el-table-column prop="contractPrice" label="合同房价"></el-table-column>
      <el-table-column prop="commissionPrice" label="真实房价"></el-table-column>
      <el-table-column label="佣金比例">
        <template slot-scope="scope">
          {{scope.row.commissionRatio * 100}}%
        </template>
      </el-table-column>
      <el-table-column prop="commissionMoney" label="佣金金额"></el-table-column>
      <el-table-column label="佣金单状态">
        <template slot-scope="scope">
          {{commissionStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="结算时间">
        <template slot-scope="scope">
          {{scope.row.payTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm title="确认结算该笔佣金吗？" @confirm="confirmCommission(scope.row.id)" v-if="scope.row.status==='0'">
            <el-button size="mini" type="primary" slot="reference">结算</el-button>
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
    name: "commissionList",
    created:function() {
      this.queryCommissionList();
      this.querySaleUser();
    },
    data:function() {
      return {
        tableData:[],
        searchParam:{'pageNo':1,'pageSize':10,'status':'0'},
        tableTotalRecord:0,
        commissionStatus:{'-1':'作废','0':'未结算','1':'已结算'},
        commissionStatusArr:[{'key':'未结算','value':'0'},{'key':'已结算','value':'1'}],
        saleUser:[]
      }
    },
    methods:{
      confirmCommission:function(commissionId){
        this.$http.post(pixUrl + '/commission/confirmCommission', {'id':commissionId,'status':'1'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.$notify({
              title: '提醒',
              message: result.message,
              type: 'success',
              duration: 1500,
              offset: 100,
              onClose: () => {
                this.queryCommissionList()
              }
            });
          }
        }, function () {
          console.log('保存信息失败');
        });
      },
      queryCommissionList:function(){
        this.$http.post(pixUrl + '/commission/queryCommissionList', this.searchParam).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.tableData = result.result
            this.tableTotalRecord = result.totalRecord
          }
        }, function () {
          console.log('查询缴费列表抵账！');
        });
      },
      pageSizeChange:function(val){
        this.searchParam.pageSize = val
        this.queryCommissionList()
      },
      pageNoChange:function(val){
        this.searchParam.pageNo = val
        this.queryCommissionList()
      },
      tableRowClassName:function(row, rowIndex){
        row.toString()
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        }else{
          return 'success-row'
        }
      },
      querySaleUser:function() {
        this.$http.post(pixUrl + '/user/queryUserByStatus', {'status': '1'}).then(function (res) {
          let result = res.body;
          if (result.ok) {
            this.saleUser = res.body.result;
          }
        }, function () {
          console.log('查询销售员失败');
        });
      },
      inputTimeOut:function(){
        if (this.timer) {
          clearTimeout(this.timer)
        }
        let thiz = this;
        this.timer = setTimeout(function() {
          thiz.queryCommissionList();
        }, 500)
      },
      sortChange:function(param){
        this.searchParam.sortKey = param.prop
        this.searchParam.sort = param.order
        this.queryCommissionList();
      },
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
