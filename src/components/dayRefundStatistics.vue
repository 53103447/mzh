<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        受理日期
      </el-col>
      <el-col :span="23">
        <el-date-picker v-model="searchParam.created" type="date" format="yyyy-MM-dd" @change="datePickerChange">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-tabs value="first">
      <el-tab-pane label="退款信息" name="first">
        <span slot="label" style="font-size: 18px;">退款列表</span>
        <h2 v-if="tableData === null || tableData.length < 1">无退款记录</h2>
        <el-card class="box-card" style="margin-bottom: 30px;" v-for="item in tableData" :key="item.id">
          <div slot="header" class="clearfix">
            <span>房间号：{{item.roomNum}}</span>
          </div>
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="2">
              受理日期：
            </el-col>
            <el-col :span="4">
              {{item.created | formatDate }}
            </el-col>
            <el-col :span="2">
              退租类型：
            </el-col>
            <el-col :span="4">
              {{checkOutType[item.checkOutType]}}
            </el-col>
            <el-col :span="2">
              退款金额：
            </el-col>
            <el-col :span="4">
              {{item.totalFee}}
            </el-col>
            <el-col :span="2">
              状态：
            </el-col>
            <el-col :span="4">
              {{refundStatus[item.status]}}
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-table :data="JSON.parse(item.refundDetail)" border show-summary style="width: 100%">
            <el-table-column prop="subject" label="收费科目"></el-table-column>
            <el-table-column prop="price" label="金额"></el-table-column>
          </el-table>
        </el-card>
        <div>
          <el-card class="box-card" style="width:25%;margin-right:30px;margin-bottom:20px;float: right">
            <el-row type="flex" justify="end" align="middle" style="padding: 5px;font-size: 22px;font-weight: 800">
              <el-col :span="16">总计金额：</el-col>
              <el-col :span="8">123</el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="24"><el-button type="primary">确认无误，下一步</el-button></el-col>
            </el-row>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "dayRefundStatistics",
    created: function () {
      this.dayRefundStatistics();
    },
    data: function () {
      return {
        tableData: [],
        searchParam: {'created': new Date().getTime()},
        payType: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金', '5': '组合支付'},
        checkOutType: {'2': "到期退房", '3': "违约退房", '4': "提前退房"},
        refundPayType: {'1': "微信", '2': "支付宝", '3': "银行卡", '4': "换房结转"},
        refundStatus: {'0': "待退款", '1': "已退款"}
      }
    },
    methods: {
      dayRefundStatistics: function () {
        let thiz = this
        this.$http.post(pixUrl + '/settlement/selectRefundByTime', this.searchParam).then(function (res) {
          const result = res.body;
          if (result.ok) {
            thiz.tableData = result.result
          }
        }, function () {
          console.log('查询销售员失败');
        });
      },
      datePickerChange:function(){
        this.dayRefundStatistics();
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
