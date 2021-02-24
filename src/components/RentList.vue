<template>
  <div style="padding: 15px">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        房间号
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.roomNum" placeholder="请输入房间号" clearable size="small" @input="queryRentInfo"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        客户姓名
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.customerName" placeholder="请输入客户姓名" clearable size="small" @input="queryRentInfo"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" border style="width: 100%" size="small">
      <el-table-column prop="roomNum" label="房间号"> </el-table-column>
      <el-table-column prop="contractNo" label="合同号"> </el-table-column>
      <el-table-column prop="customerName" label="租户"> </el-table-column>
      <el-table-column prop="mobilePhone" label="租户电话"> </el-table-column>
      <el-table-column prop="rentPrice" label="房价"> </el-table-column>
      <el-table-column label="合同开始日期">
        <template slot-scope="scope">
          {{scope.row.contractStart | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="合同结束日期">
        <template slot-scope="scope">
          {{scope.row.contractEnd | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="currentDateRange" label="当前缴费覆盖日期" width="180px"></el-table-column>
      <el-table-column prop="surplusDay" label="剩余天数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toRentMoney(scope.row.id)">缴费</el-button>
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

    <!-- 缴费信息 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" :show-close="false" top="10px">
      <div slot="title">
        <el-row type="flex" class="row-bg" justify="center" align="middle">
          <el-col :span="12">
            <h2>交租信息</h2>
          </el-col>
          <el-col :span="12" :offset="12">
            <el-button type="danger" @click="saveRentInfo">保存</el-button>
            <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-form ref="rentForm" :model="rentForm" :rules="rules" label-width="160px">
          <el-form-item label="房间号">
            {{rentForm.roomNum}}
          </el-form-item>
          <el-form-item label="客户姓名">
            {{rentForm.customerName}}
          </el-form-item>
          <el-form-item label="当期租金覆盖日期">
            {{rentForm.currentDateRange}}
          </el-form-item>
          <el-form-item label="租金金额">
            {{rentForm.rentPrice}}
          </el-form-item>
          <el-form-item label="水表数">
            <el-input v-model="rentForm.waterNum" placeholder="水表数" style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item label="水费" prop="waterPrice">
            <el-input v-model.number="rentForm.waterPrice" placeholder="水费" style="width: 217px" @blur="waterPriceChange"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="payType">
            <el-select v-model="rentForm.payType" clearable placeholder="支付方式">
              <el-option v-for="item in payTypeMap" :key="item.id" :label="item.key"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总计金额">
            {{rentForm.totalFee}}
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="rentForm.remark" placeholder="备注" style="width: 217px"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "RentList",
    created() {
      this.queryRentInfo()
    },
    data() {
      return {
        tableData:[],
        searchParam:{'pageNo':1,'pageSize':10},
        tableTotalRecord:0,
        dialogVisible:false,
        rentForm:{},
        payTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {'key': 'POS机','value': '3'}, {'key': '现金', 'value': '4'}],
        rules: {
          waterPrice:[
            {type: 'number', message: '请输入数字', trigger: 'blur'},
          ],
          payType: [
            {required: true, message: '请选择收款方式', trigger: 'change'}
          ]
        }
      }
    },
    methods:{
      queryRentInfo(){
        this.$http.post(pixUrl + '/rent/queryRentList', this.searchParam).then(function (res) {
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
      toRentMoney(rentId){
        this.$http.post(pixUrl + '/rent/queryRentById', {'id':rentId}).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.rentForm = result.result
            this.rentForm.totalFee = this.rentForm.rentPrice
            this.dialogVisible = true
          }
        }, function () {
          console.log('查询缴费详情失败！');
        });
      },
      waterPriceChange(){
        if(!this.isEmpty(this.rentForm.waterPrice) && Number.isInteger(this.rentForm.waterPrice)){
          this.rentForm.totalFee = this.rentForm.rentPrice + this.rentForm.waterPrice
        }else{
          this.rentForm.totalFee = this.rentForm.rentPrice
        }
      },
      saveRentInfo(){
        this.$refs['rentForm'].validate((valid) => {
          if (valid) {
            this.rentForm.status = '1'
            this.$http.post(pixUrl + '/rent/updateRentById', this.rentForm).then(function (res) {
              const result = res.body;
              if (result.ok) {
                this.searchParam.pageNo = 1
                this.queryRentInfo()
                this.dialogVisible = false
              }
            })
          }
        })
      },
      isEmpty(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
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

<style scoped>

</style>
