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
    <el-table :data="tableData" border style="width: 100%" size="small" @sort-change="sortChange">
      <el-table-column prop="roomNum" label="房间号"></el-table-column>
      <el-table-column prop="contractNo" label="合同号"></el-table-column>
      <el-table-column prop="customerName" label="租户"></el-table-column>
      <el-table-column prop="customerMobile" label="租户电话"></el-table-column>
      <el-table-column prop="realPrice" label="房价"></el-table-column>
      <el-table-column prop="contractStart" label="合同开始日期" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.contractStart | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="contractEnd" label="合同结束日期" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.contractEnd | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="contractRealEnd" label="合同实际结束时间" sortable="custom" width="150px">
        <template slot-scope="scope">
          {{scope.row.contractRealEnd | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="contractMonthNum" label="合同期限" sortable="custom"></el-table-column>
      <el-table-column prop="realPrice" label="合同价格" sortable="custom"></el-table-column>
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
            <div v-if="enterResult.contract.payType!='5'">
              支付方式：{{payTypeSelect[enterResult.contract.payType]}}
            </div>
            <div v-if="enterResult.contract.payType === '5'">
              <el-row>
                <el-col :span="4">支付方式：</el-col>
                <el-col :span="20"><div v-for="(item,index) in JSON.parse(enterResult.contract.mixPayDetail)" :key="index">{{payTypeSelect[item.payType]}}：{{item.price}}</div></el-col>
              </el-row>
            </div>
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
              <el-table-column label="支付方式" width="140">
                <template slot-scope="scope">
                  <div v-if="scope.row.payType!='5'">
                    {{payTypeSelect[scope.row.payType]}}
                  </div>
                  <div v-if="scope.row.payType === '5'">
                    <div v-for="(item,index) in JSON.parse(scope.row.mixPayDetail)" :key="index">{{payTypeSelect[item.payType]}}：{{item.price}}</div>
                  </div>
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
              <el-row type="flex" class="row-bg" justify="center" align="middle" style="width:98%">
                <el-col :span="12">
                  <h3>居住人详情</h3>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-button icon="el-icon-plus" type="primary" size="mini" circle @click.stop="customerDialog=true"></el-button>
                </el-col>
              </el-row>
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

      <el-dialog width="30%" title="添加同住人" :visible.sync="customerDialog" append-to-body>
        <el-form :model="customerForm" :rules="rules" ref="customerForm" label-position="right" label-width="120px">
          <el-form-item label="同住人姓名" prop="customerName">
            <el-input v-model="customerForm.customerName" placeholder="同住人姓名" style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item label="证件号" prop="cardNo">
            <el-input v-model="customerForm.cardNo" placeholder="证件号" maxlength="18" style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item label="证件有效期" prop="cardEffective">
            <el-date-picker
                    v-model="customerForm.cardEffective"
                    type="date"
                    :picker-options="pickerDisableOptions"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="customerForm.sex" label="M">男</el-radio>
            <el-radio v-model="customerForm.sex" label="F">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model="customerForm.mobilePhone" maxlength="11" placeholder="手机号"
                      style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item label="户籍地址" prop="permanentAddress">
            <el-input v-model="customerForm.permanentAddress" type="textarea" :rows="3"
                      placeholder="户籍地址" style="width: 217px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="customerDialog=false">取 消</el-button>
          <el-button type="primary" @click="saveCustomer">确 定</el-button>
        </span>
      </el-dialog>

    </el-dialog>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "ContractList",
    created() {
      this.queryContractList()
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
        enterResult: {'room': {}, 'contract': {}, 'customers': []},
        customerDialog:false,
        pickerDisableOptions: {
          disabledDate(time) {
            const tomorrow = Date.now()
            return time.getTime() < tomorrow;
          },
        },
        customerForm:{},
        rules: {
          customerName: [
            {required: true, message: '请输入租房姓名', trigger: 'blur'},
          ],
          cardType: [
            {required: true, message: '请选择证件类型', trigger: 'change'}
          ],
          cardNo: [
            {required: true, message: '请输入证件号', trigger: 'blur'},
            {pattern: '^[1-9]\\d{5}(18|19|20|(3\\d))\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$', message: '身份证号格式不正确', trigger: 'blur'},
          ],
          cardEffective: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
          mobilePhone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: '^1[0-9]{10}$', message: '手机号格式不正确', trigger: 'blur'},
          ],
          permanentAddress: [
            {required: true, message: '请输入户籍地址', trigger: 'blur'},
          ],
        }
      }
    },
    methods:{
      sortChange:function( param ){
        this.searchParam.sortKey = param.prop
        this.searchParam.sort = param.order
        console.log(this.searchParam)
        this.queryContractList();
      },
      saveCustomer(){
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            this.customerForm.contractId = this.enterResult.contract.id;
            this.$http.post(pixUrl + '/customer/addCohabitant', this.customerForm).then(function (res) {
              const result = res.body;
              if (result.ok) {
                this.$notify({
                  title: '提醒',
                  message: result.message,
                  type: 'success',
                  duration: 1500,
                  offset: 100,
                  onClose: () => {
                    this.queryContractInfo(this.enterResult.contract.id)
                    this.customerDialog=false
                  }
                });
              }
            }, function () {
              console.log('保存信息失败');
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      queryContractList(){
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
      queryContractInfo(contractId){
        this.$http.post(pixUrl + '/integration/queryContractInfo', {'contractId': contractId}).then(function (res) {
          if (res.body.ok) {
            this.enterResult = res.body.result
          }
        }, function () {
          console.log('by手机号预定信息');
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
      inputTimeOut(){
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.queryContractList();
        }, 500)
      },
      toDetail(contractId){
        this.queryContractInfo(contractId);
        this.showEnter = true
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
