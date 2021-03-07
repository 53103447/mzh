<template>
  <div style="padding: 15px">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        客户姓名
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.name" placeholder="客户姓名" clearable size="small" @input="inputTimeOut"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        手机号：
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.mobilePhone" placeholder="手机号" clearable size="small" @input="inputTimeOut"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        房间号
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.roomNum" placeholder="房间号" clearable size="small" @input="inputTimeOut"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        在住状态
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.liveIn" clearable placeholder="请选择" @change="queryCustomerList">
          <el-option v-for="item in liveInStatusArr" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-button @click="exportCustomer">导出</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" border style="width: 100%" size="small">
      <el-table-column label="门店">
        <template>
          上海8+1青年社区
        </template>
      </el-table-column>
      <el-table-column prop="name" label="客户姓名"></el-table-column>
      <el-table-column label="客户性别">
        <template slot-scope="scope">
          {{scope.row.sex ==='M'?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column prop="cardNo" label="证件号码"></el-table-column>
      <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
      <el-table-column prop="roomNum" label="房间号"></el-table-column>
      <el-table-column label="居住状态">
        <template slot-scope="scope">
          {{scope.$index}}
          {{ liveInStatus[scope.row.liveIn] }}
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
      this.queryCustomerList()
    },
    data() {
      return {
        tableData:[],
        searchParam:{'pageNo':1,'pageSize':10,'liveIn':'1'},
        tableTotalRecord:0,
        liveInStatus:{'0':'已退','1':'在住'},
        liveInStatusArr:[{'key': '已退', 'value': '0'}, {'key': '在住', 'value': '1'}]
      }
    },
    methods:{
      exportCustomer(){
        window.open("customer/exportCustomer/"+JSON.stringify(this.searchParam))
      },
      queryCustomerList:function(){
        this.$http.post(pixUrl + '/customer/selectCustomerByPage', this.searchParam).then(function (res) {
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
        this.queryCustomerList()
      },
      pageNoChange:function(val){
        this.searchParam.pageNo = val
        this.queryCustomerList()
      },
      inputTimeOut:function(){
        if (this.timer) {
          clearTimeout(this.timer)
        }
        let thiz = this
        this.timer = setTimeout(function() {
          thiz.searchParam.pageNo=1
          thiz.queryCustomerList();
        }, 500)
      },
    }
  }
</script>

<style scoped>

</style>