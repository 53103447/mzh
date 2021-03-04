<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        收费时间
      </el-col>
      <el-col :span="11">
        <el-date-picker v-model="searchParam.payTime" type="date" format="yyyy-MM-dd" @change="datePickerChange">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div>
      <div v-for="(value, key) in tableData.roomPayDetail" :key="key">
        <span>房间号：{{key}}</span>
        <el-table :data="value" border style="width: 100%" size="small" :summary-method="getSummaries" show-summary>
          <el-table-column prop="roomNum" label="房间号"></el-table-column>
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
          <el-table-column prop="payPrice" label="总计"></el-table-column>
        </el-table>
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
        console.log(param);
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
      }
    }
  }
</script>

<style scoped>

</style>
