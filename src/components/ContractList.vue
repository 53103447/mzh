<template>
  <div style="padding: 15px">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        房间号
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.roomNum" placeholder="请输入房间号" clearable size="small" @input="queryContractInfo"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        客户姓名
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.customerName" placeholder="请输入客户姓名" clearable size="small" @input="queryContractInfo"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        合同状态
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.status" clearable placeholder="请选择" @change="queryContractInfo">
          <el-option v-for="item in contractStatusMap" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        办理状态
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.handleStatus" clearable placeholder="请选择" @change="queryContractInfo">
          <el-option v-for="item in handelStatusMap" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" border style="width: 100%" size="small">
      <el-table-column prop="roomNum" label="房间号"></el-table-column>
      <el-table-column prop="contractNo" label="合同号"></el-table-column>
      <el-table-column prop="customerName" label="租户"></el-table-column>
      <el-table-column prop="customerMobile" label="租户电话"></el-table-column>
      <el-table-column prop="realPrice" label="房价"></el-table-column>
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
      <el-table-column prop="contractRealEnd" label="合同实际结束时间" width="180px"></el-table-column>
      <el-table-column prop="contractMonthNum" label="合同期限"></el-table-column>
      <el-table-column prop="realPrice" label="合同价格"></el-table-column>
      <el-table-column label="长短租类型">
        <template slot-scope="scope">
          {{scope.row.contractMonthNum>=6?'长租':'短租'}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{contractStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toDetail(scope.row.id)">合同详情</el-button>
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
    <el-dialog :visible.sync="showEnter" :show-close="false" width="80%" top="10px">
      <div slot="title">
        <el-row type="flex" class="row-bg" justify="center" align="middle">
          <el-col :span="12">
            <h2>合同详情</h2>
          </el-col>
          <el-col :span="12" :offset="20">
            <el-button type="primary" @click="showEnter = false">关 闭</el-button>
          </el-col>
        </el-row>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: 18px;font-weight: 700">房间信息</span>
        </div>
        <el-row>
          <el-col :span="6">
            社区：{{enterResult.room.store}}
          </el-col>
          <el-col :span="18">
            房间号：{{enterResult.room.roomNum}}
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: 18px;font-weight: 700">合同信息</span>
        </div>
        <el-row>
          <el-col :span="6">
            签约人：{{enterResult.contract.customerName}}
          </el-col>
          <el-col :span="6">
            联系电话：{{enterResult.contract.customerMobile}}
          </el-col>
          <el-col :span="12">
            销售员：{{enterResult.contract.saleName}}
          </el-col>
        </el-row>
        <br/>
        <el-row>
          <el-col :span="6">
            合同开始时间：{{enterResult.contract.contractStart | formatDate}}
          </el-col>
          <el-col :span="6">
            合同结束时间：{{enterResult.contract.contractEnd | formatDate}}
          </el-col>
          <el-col :span="12">
            合同期限：{{enterResult.contract.contractMonthNum}}个月
          </el-col>
        </el-row>
        <br/>
        <el-row>
          <el-col :span="6">
            房间价格：{{enterResult.contract.realPrice}}元
          </el-col>
          <el-col :span="6">
            押金：{{enterResult.contract.deposit}}元
          </el-col>
          <el-col :span="12">
            支付方式：{{payTypeSelect[enterResult.contract.payType]}}
          </el-col>
        </el-row>
        <br/>
        <el-row>
          <el-col :span="6">
            合同状态：{{contractStatus[enterResult.contract.status]}}
          </el-col>
          <el-col :span="18">
            备注：{{enterResult.contract.remark}}
          </el-col>
        </el-row>
        <br/>
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <h3>交租单详情</h3>
            </template>
            <el-table :data="enterResult.rents" border style="width: 100%">
              <el-table-column prop="contractNo" label="合同号" width="200"></el-table-column>
              <el-table-column prop="customerName" label="客户姓名" width="120"></el-table-column>
              <el-table-column prop="currentDateRange" label="租金覆盖范围" width="230"></el-table-column>
              <el-table-column prop="rentPrice" label="租金金额" width="120"></el-table-column>
              <el-table-column prop="waterNum" label="水表度数" width="120"></el-table-column>
              <el-table-column prop="waterPrice" label="水费" width="120"></el-table-column>
              <el-table-column prop="totalFee" label="交租单总计" width="120"></el-table-column>
              <el-table-column label="支付方式" width="100">
                <template slot-scope="scope">
                  {{payTypeSelect[scope.row.payType]}}
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <el-button
                          :type="scope.row.status=='0'?'danger':scope.row.status=='1'?'success':'warning'"
                          plain disabled>{{rentStatusMap[scope.row.status]}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <br/>
      <el-card class="box-card">
        <el-collapse v-model="collapseItem">
          <el-collapse-item name="1">
            <template slot="title">
              <h3>居住人详情</h3>
            </template>
            <el-table :data="enterResult.customers" border style="width: 100%">
              <el-table-column label="客户类型">
                <template slot-scope="scope">
                  {{scope.$index==0?'签约人':'同住人' }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="客户姓名"></el-table-column>
              <el-table-column label="性别">
                <template slot-scope="scope">
                  {{scope.row.sex=='M'?'男':'女' }}
                </template>
              </el-table-column>
              <el-table-column label="证件类型">
                <template slot-scope="scope">
                  {{scope.row.cardType=='1'?'身份证':'其他' }}
                </template>
              </el-table-column>
              <el-table-column prop="cardNo" label="证件号码" width="200"></el-table-column>
              <el-table-column label="证件有效期">
                <template slot-scope="scope">
                  {{scope.row.cardEffective | formatDate }}
                </template>
              </el-table-column>
              <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
              <el-table-column prop="urgentPeople" label="紧急联系人"></el-table-column>
              <el-table-column prop="urgentPhone" label="联系人手机"></el-table-column>
              <el-table-column prop="permanentAddress" label="户籍地址" width="200"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "ContractList",
    created() {
      this.queryContractInfo()
    },
    data() {
      return {
        tableData: [],
        tableTotalRecord:0,
        searchParam:{'pageNo':1,'pageSize':10},
        contractStatus:{'1':'执行中','2':'到期退租','3':'违约退租','4':'提前退租'},
        payTypeSelect: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金'},
        rentStatusMap:{'0':'待交租','1':'已交租','2':'违约'},
        contractStatusMap:[{'key': '执行中', 'value': '1'}, {'key': '到期退房', 'value': '2'}, {'key': '违约退房','value': '3'}, {'key': '提前退房', 'value': '4'}],
        handelStatusMap:[{'key': '新签', 'value': '1'}, {'key': '换房', 'value': '2'}, {'key': '续租','value': '3'}, {'key': '员工', 'value': '4'}],
        collapseItem: ['1'],
        showEnter:false,
        enterResult: {'room': {}, 'contract': {}, 'customers': []}
      }
    },
    methods:{
      queryContractInfo(){
        this.$http.post(pixUrl + '/contract/queryContractList', this.searchParam).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.tableData = result.result
            this.tableTotalRecord = result.totalRecord
          }
        }, function () {
          console.log('查询缴费列表失败！');
        });
      },
      pageSizeChange(val){
        this.searchParam.pageSize = val
        this.queryContractInfo()
      },
      pageNoChange(val){
        this.searchParam.pageNo = val
        this.queryContractInfo()
      },
      toDetail(contractId){
        this.$http.post(pixUrl + '/integration/queryContractInfo', {'contractId': contractId}).then(function (res) {
          if (res.body.ok) {
            this.enterResult = res.body.result
            this.showEnter = true
          }
        }, function () {
          console.log('by手机号预定信息');
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
