<template>
  <div>
    <el-row type="flex" justify="end" align="middle">
      <el-col :span="24" style="padding: 15px;">
        <el-button type="primary" @click="saveRenewal">保 存</el-button>
      </el-col>
    </el-row>
    <el-form :model="renewalForm" :rules="rules" ref="renewalForm" label-position="right" label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="房间信息" name="first">
              <el-form-item label="房间号" prop="roomId">
                <el-select v-model="renewalForm.roomId" filterable placeholder="请选择房间" @change="roomChange">
                  <el-option v-for="item in enterRoom" :key="item.id" :label="item.roomNum" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同期限">
                <el-input-number v-model="renewalForm.contractMonthNum" :min="1" :max="12"></el-input-number>
              </el-form-item>
              <el-form-item label="合同开始日期">
                {{getNextDay(enterResult.contract.contractEnd,1) | formatDate}}
              </el-form-item>
              <el-form-item label="合同结束日期">
                {{getNextMonth(getNextDay(enterResult.contract.contractEnd,1),renewalForm.contractMonthNum)}}
              </el-form-item>
              <el-form-item label="租客姓名">
                {{customer.name}}
              </el-form-item>
              <el-form-item label="证件类型" prop="cardType">
                {{customer.cardType === '1'?'身份证':'其他'}}
              </el-form-item>
              <el-form-item label="证件号" prop="cardNo">
                {{customer.cardNo}}
              </el-form-item>
              <el-form-item label="证件有效期" prop="cardEffective">
                {{customer.cardEffective | formatDate}}
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                {{customer.sex === 'M'?'男':'女'}}
              </el-form-item>
              <el-form-item label="手机号" prop="mobilePhone">
                {{customer.mobilePhone}}
              </el-form-item>
              <el-form-item label="户籍地址" prop="permanentAddress">
                {{customer.permanentAddress}}
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="合住人与紧急联系人" name="first">
              <div v-for="item in enterResult.customers" :key="item.id">
                <el-form-item label="同住人姓名">
                  {{item.name}}
                </el-form-item>
                <el-form-item label="证件类型">
                  {{item.cardType === '1'?'身份证':'其他'}}
                </el-form-item>
                <el-form-item label="证件号" prop="sharingCardNo">
                  {{item.cardNo}}
                </el-form-item>
                <el-form-item label="证件有效期">
                  {{item.cardEffective | formatDate}}
                </el-form-item>
                <el-form-item label="性别">
                  {{item.sex === 'M'?'男':'女'}}
                </el-form-item>
                <el-form-item label="手机号">
                  {{item.mobilePhone}}
                </el-form-item>
                <el-form-item label="户籍地址">
                  {{item.permanentAddress}}
                </el-form-item>
              </div>
              <div v-for="(item,index) in renewalForm.cohabitant" :key="index">
                <el-form-item label="同住人姓名">
                  <el-input v-model="item.name" placeholder="同住人姓名" style="width: 217px"></el-input>
                  <el-button type="primary" icon="el-icon-delete" size="mini" circle @click="deleteCohabitant(index)" style="margin-left: 5px"></el-button>
                </el-form-item>
                <el-form-item label="证件类型">
                  <el-select v-model="item.cardType" clearable placeholder="证件类型">
                    <el-option label="身份证" value="1"></el-option>
                    <el-option label="其他" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证件号">
                  <el-input v-model="item.cardNo" placeholder="证件号" maxlength="18" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="证件有效期">
                  <el-date-picker
                          v-model="item.cardEffective"
                          type="date"
                          :picker-options="pickerDisableOptions"
                          placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio v-model="item.sex" label="M">男</el-radio>
                  <el-radio v-model="item.sex" label="F">女</el-radio>
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="item.mobilePhone" maxlength="11" placeholder="手机号" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="户籍地址">
                  <el-input v-model="item.permanentAddress" type="textarea" :rows="3" placeholder="户籍地址" style="width: 217px"></el-input>
                </el-form-item>
              </div>
              <el-row type="flex" justify="center">
                <el-col :span="24" style="text-align: center">
                  <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addCohabitant">新增同住人
                  </el-button>
                </el-col>
              </el-row>
              <br/>
              <el-form-item label="紧急联系人" prop="urgentPeople">
                {{customer.urgentPeople}}
              </el-form-item>
              <el-form-item label="联系人手机号" prop="urgentPhone">
                {{customer.urgentPhone}}
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="房租费用" name="first">
              <el-form-item label="当前房价">
                {{enterResult.contract.realPrice}}
              </el-form-item>
              <el-form-item label="成交房价" prop="realPrice">
                <el-input v-model.number="renewalForm.realPrice" placeholder="成交房价" maxlength="4"
                          style="width: 217px" @input="computeTotalFee"></el-input>
              </el-form-item>
              <el-form-item label="押金">
                {{enterResult.contract.deposit}}
              </el-form-item>
              <el-form-item label="收款方式" prop="payType">
                <!-- 这里应该是个select，自己员工表中的人，加上分销团队名 -->
                <el-select v-model="renewalForm.payType" clearable placeholder="支付方式">
                  <el-option v-for="item in payTypeMap" :key="item.id" :label="item.key"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="水表数">
                <el-input v-model.number="renewalForm.waterNum" placeholder="水表数" style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="水费">
                <el-input v-model.number="renewalForm.waterPrice" @input="computeTotalFee" placeholder="水费" style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="销售员">
                {{enterResult.contract.saleName}}
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="renewalForm.remark" placeholder="备注" style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="费用合计">
                {{renewalForm.totalFee}}
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "Renewal",
    created() {
      this.queryRoomByStatus();
      // this.queryUserByStatus();
    },
    data() {
      return {
        renewalForm: {'contractMonthNum':1,'cohabitant':[]},
        rules:{
          roomId: [
            {required: true, message: '请选择房间号', trigger: 'change'}
          ],
          realPrice: [
            {required: true, message: '请输入成交房价', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          payType: [
            {required: true, message: '请选择收款方式', trigger: 'change'}
          ]
        },
        enterRoom:{},
        enterResult: {'room': {}, 'contract': {}, 'customers': []},
        customer:{},
        payTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {'key': 'POS机','value': '3'}, {'key': '现金', 'value': '4'}],
        pickerDisableOptions: {
          disabledDate(time) {
            const tomorrow = Date.now()
            return time.getTime() < tomorrow;
          },
        }
      }
    },
    methods:{
      queryRoomByStatus() {
        this.$http.post(pixUrl + '/room/queryExpireRoom', {}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.enterRoom = result.result
          }
        }, function () {
          console.log('By房间状态请求失败');
        });
      },
      queryRoomInfo(roomId) {
        this.$http.post(pixUrl + '/integration/queryRoomInfo', {'roomId': roomId}).then(function (res) {
          if (res.body.ok) {
            this.enterResult = res.body.result
            this.customer = this.enterResult.customers.shift();
            this.renewalForm.contractId = this.enterResult.contract.id
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      saveRenewal(){
        this.$refs['renewalForm'].validate((valid) => {
          if (valid) {
            this.$http.post(pixUrl + '/integration/renewalContract', this.renewalForm).then(function (res) {
              const result = res.body;
              if (result.ok) {
                alert(123);
              }
            })
          }
        })
      },
      roomChange(roomId){
        this.queryRoomInfo(roomId)
      },
      addCohabitant() {
        console.log(this.renewalForm.cohabitant)
        this.renewalForm.cohabitant.push({'id': this.isEmpty(this.renewalForm.cohabitant)?1:this.renewalForm.cohabitant.length + 1});
      },
      deleteCohabitant(index) {
        this.renewalForm.cohabitant.splice(index, 1);
      },
      computeTotalFee(){
        let realPrice = this.isEmpty(this.renewalForm.realPrice)?0:this.renewalForm.realPrice
        let waterPrice = this.isEmpty(this.renewalForm.waterPrice)?0:this.renewalForm.waterPrice
        this.renewalForm.totalFee = realPrice + waterPrice
      },
      isEmpty(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
        }
      },
      getNextDay(date, addDay) {
        if (this.isEmpty(date)) return ''
        // var day3 = new Date();
        date = new Date(date)
        date.setTime(date.getTime() + addDay*24*60*60*1000);
        return date;
      },
      getNextMonth(date, addMonth) {
        if (this.isEmpty(date)) return ''
        date = new Date(date)
        let year = date.getFullYear(); //获取当前日期的年份
        let month = date.getMonth() + 1; //获取当前日期的月份
        let day = date.getDate() - 1; //获取当前日期的日
        let year2 = year;
        let month2 = parseInt(month) + addMonth;
        if (month2 > 12) {
          year2 = parseInt(year2) + 1;
          month2 = month2 - 12;
        }
        let day2 = day;
        let days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }

        let t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
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