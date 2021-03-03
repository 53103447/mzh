<template>
  <div style="padding: 15px">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        房间号
      </el-col>
      <el-col :span="11">
        <el-date-picker v-model="searchParam.searchTime" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" @change="datePickerChange">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="roomNum" label="房间号"></el-table-column>
      <el-table-column prop="customerName" label="租户"></el-table-column>
      <el-table-column prop="customerPhone" label="租户电话"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.created | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="缴费时间">
        <template slot-scope="scope">
          {{scope.row.payTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="支付方式">
        <template slot-scope="scope">
          {{ payType[scope.row.payType]}}
        </template>
      </el-table-column>
      <el-table-column label="费用类型">
        <template slot-scope="scope">
          {{ payMode[scope.row.payMode]}}
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="金额"></el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark.indexOf('null')>-1?'':scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="voidMixPay(scope.row.id)">作废</el-button>
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
    name: "payDetailList",
    created:function() {
      /*Vue.http.interceptors.push(function(request, next) {
        // modify request
        request.method = 'POST';//在请求之前可以进行一些预处理和配置
        // continue to next interceptor
        next(function(response) {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
          let result = response.body;
          if(result.status === '2'){
            this.$confirm('登录超时，请重新登录?', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(function() {
              parent.window.location.href="/page/login";
            })
          }else{
            return response;
          }
        });
      });*/
      this.queryPayDetailList()
    },
    data:function() {
      return {
        tableData:[],
        searchParam:{'pageNo':1,'pageSize':10},
        tableTotalRecord:0,
        payType: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金'},
        payMode: {'1': "新签",'2':'续租','3':'换房', '4': "租金", '5': "水费", '6': '门卡','7':'其他',}
      }
    },
    methods:{
      queryPayDetailList:function(){
        const loading = this.$loading({lock: true,text: 'Loading',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.7)'});
        this.$http.post(pixUrl + '/payDetail/selectALLByPage', this.searchParam).then(function (res) {
          let result = res.body;
          if(result.ok){
            this.tableData = result.result
            this.tableTotalRecord = result.totalRecord
            loading.close()
          }
        }, function () {
          console.log('查询缴费列表抵账！');
        });
      },
      pageSizeChange:function(val){
        this.searchParam.pageSize = val
        this.queryPayDetailList()
      },
      pageNoChange:function(val){
        this.searchParam.pageNo = val
        this.queryPayDetailList()
      },
      datePickerChange(){
        console.log(this.searchParam.searchTime)
        this.searchParam.startTime = this.searchParam.searchTime[0]
        this.searchParam.endTime = this.searchParam.searchTime[1]
        this.queryPayDetailList();
      },
      isEmpty:function(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
        }
      },
      tableRowClassName:function(row, rowIndex){
        row.toString()
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        }else{
          return 'success-row'
        }
      },
      voidMixPay:function(mixId){
        let thiz = this
        this.$prompt('请输入作废理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(function(param) {
          thiz.$http.post(pixUrl + '/integration/voidMixPay', {'id':mixId,'remark':param.value}).then(function (res) {
            const result = res.body;
            if (result.ok) {
              this.queryPayDetailList();
            }
          })
        })
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