<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        房间号
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.roomNum" placeholder="请输入房间号" clearable size="small" @input="inputTimeOut"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        办理状态
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.handelType" clearable placeholder="请选择" @change="queryRoomCardList">
          <el-option v-for="item in handelTypeArr" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        支付方式
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.payType" clearable placeholder="请选择" @change="queryRoomCardList">
          <el-option v-for="item in payTypeArr" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName" header-row-class-name="headerClass">
      <el-table-column prop="roomNum" label="房间号"></el-table-column>
      <el-table-column prop="roomCardNum" label="门卡张数"></el-table-column>
      <el-table-column label="办理类型">
        <template slot-scope="scope">
          {{handelType[scope.row.handelType]}}
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          {{payType[scope.row.payType]}}
        </template>
      </el-table-column>
      <el-table-column label="办理日期">
        <template slot-scope="scope">
          {{scope.row.created | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="roomCardPrice" label="金额"></el-table-column>
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
      this.queryRoomCardList()
    },
    data() {
      return {
        tableData:[],
        tableTotalRecord:0,
        searchParam:{'pageNo':1,'pageSize':10},
        payType: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金'},
        payTypeArr: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {'key': 'POS机','value': '3'}, {'key': '现金', 'value': '4'}],
        handelType: {'1':'新入住','2':'补卡'},
        handelTypeArr: [{'key': '新入住', 'value': '1'}, {'key': '补卡', 'value': '2'}],
        intTimer: null
      }
    },
    methods:{
      queryRoomCardList(){
        this.$http.post(pixUrl + '/roomCard/selectAllByPage', this.searchParam).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.tableData = result.result
            this.tableTotalRecord = result.totalRecord
          }
        }, function () {
          console.log('查询缴费列表失败！');
        });
      },
      inputTimeOut(){
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.queryRoomCardList();
        }, 500)
      },
      pageSizeChange(val){
        this.searchParam.pageSize = val
        this.queryRoomCardList()
      },
      pageNoChange(val){
        this.searchParam.pageNo = val
        this.queryRoomCardList()
      },
      tableRowClassName({row, rowIndex}){
        row.toString()
        console.log(123)
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        }else{
          return 'success-row'
        }
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

<style>
  .el-table{
    font-size: 26px;
  }
  .headerClass{
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