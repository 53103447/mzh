<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        收费时间
      </el-col>
      <el-col :span="23">
        <el-date-picker v-model="searchParam.payTime" type="date" format="yyyy-MM-dd" @change="datePickerChange">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div>
      <el-card class="box-card" style="margin-bottom: 30px;" v-for="(value, key) in tableData.roomPayDetail" :key="key">
        <span>房间号：{{key}}</span>
        <el-table :data="value" border style="width: 100%;margin-top: 10px" size="small" :row-class-name="tableRowClassName" header-row-class-name="headerClass" :summary-method="getSummaries" show-summary>
          <el-table-column label="科目">
            <template slot-scope="scope">
              {{ payMode[scope.row.payMode]}}
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="租户"></el-table-column>
          <el-table-column prop="customerPhone" label="租户电话"></el-table-column>
          <el-table-column prop="payPrice" label="支付方式">
            <template slot-scope="scope">
              <div v-if="scope.row.payType!='5'">
                {{ payType[scope.row.payType]}}
              </div>
              <div v-if="scope.row.payType === '5'">
                <div v-for="(item,index) in JSON.parse(scope.row.mixPayDetail)" :key="index">{{payType[item.payType]}}：{{item.price}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="payPrice" label="总计（元）"></el-table-column>
          <el-table-column label="支付交易单号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.transactionNo" placeholder="支付交易单号" ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div>
        <el-card class="box-card" style="width:25%;margin-right:30px;margin-bottom:20px;float: right">
          <el-row type="flex" justify="end" align="middle" style="padding: 5px;font-size: 22px;font-weight: 800">
            <el-col :span="10">支付方式</el-col>
            <el-col :span="14">总计金额（元）</el-col>
          </el-row>
          <el-row type="flex" justify="end" align="middle" v-for="(value, key) in tableData.feeMap" :key="key" style="padding: 5px;;font-size: 18px;font-weight: 600">
            <el-col :span="10">{{payType[key]}}</el-col>
            <el-col :span="14">{{value}}</el-col>
          </el-row>
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="24"><el-button type="primary">确认无误，下一步</el-button></el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "dayPayStatistics",
    created:function(){
      this.dayPayStatistics();
    },
    data:function(){
      return {
        tableData:{},
        searchParam:{'payTime':new Date().getTime()},
        payType: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金', '5': '组合支付'},
        payMode: {'1': "新签",'2':'续租','3':'换房', '4': "租金", '5': "水费", '6': '门卡','7':'其他','8':'预订'},
      }
    },
    methods:{
      dayPayStatistics:function(){
        let thiz = this
        this.$http.post(pixUrl + '/payDetail/dayPayStatistics', this.searchParam).then(function (res) {
          const result = res.body;
          if (result.ok) {
            thiz.tableData = result.result
          }
        }, function () {
          console.log('查询销售员失败');
        });
      },
      datePickerChange:function(){
        this.dayPayStatistics();
      },
      getSummaries:function(param) {
        const columns = param.columns;
        const data = param.data;
        const sums = [];
        columns.forEach(function(column, index) {
          if (index === columns.length-2) {
            sums[index] = '总计（元）';
            return;
          }
          if(index === columns.length-1){
            let totalFee = 0
            data.forEach(function(item){
              totalFee += item.payPrice
            })
            sums[index] = totalFee;
          }else{
            sums[index]='';
          }
        });
        return sums;
      },
      tableRowClassName:function(row, rowIndex){
        row.toString()
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        }else{
          return 'success-row'
        }
      }
    }
  }
</script>

<style scoped>
  .el-table .headerClass{
    color: black;
    font-weight: 800;
    font-size: 18px;
  }
  .el-table .warning-row {
    background: #f6f6f6;
    color: black;
    font-weight: 400;
    font-size: 16px;
  }
  .el-table .success-row {
    color: black;
    font-weight: 400;
    font-size: 16px;
  }
</style>
