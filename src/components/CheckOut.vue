<template>
  <div>
    <el-row type="flex" justify="end" align="middle">
      <el-col :span="24" style="padding: 15px;">
        <el-button type="primary" @click="saveCheckOut">保 存</el-button>
      </el-col>
    </el-row>
    <el-form :model="refundForm" :rules="rules" ref="refundForm" label-position="right" label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="合同信息" name="first">
              <el-form-item label="房间号">
                <el-select v-model="refundForm.roomId" filterable placeholder="请选择入住房间" @change="roomChange">
                  <el-option v-for="item in enterRoom" :key="item.id" :label="item.roomNum" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户姓名">
                {{refundForm.customerName}}
              </el-form-item>
              <el-form-item label="合同开始日期">
                {{refundForm.contractStart | formatDate}}
              </el-form-item>
              <el-form-item label="合同结束日期">
                {{refundForm.contractEnd | formatDate}}
              </el-form-item>
              <el-form-item label="缴费开始日期">
                {{refundForm.rentStart | formatDate}}
              </el-form-item>
              <el-form-item label="缴费结束日期">
                {{refundForm.rentEnd | formatDate}}
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="退租信息" name="first">
              <el-form-item label="退租类型" prop="checkOutType">
                <el-select v-model="refundForm.checkOutType" clearable placeholder="退租类型"
                           @change="checkOutTypeChange">
                  <el-option v-for="item in refendStatusMap" :key="item.id" :label="item.key"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="退租日期">
                {{ refundForm.rentRefundDate | formatDate}}
              </el-form-item>
              <el-form-item label="逾期天数">
                {{ refundForm.overdueDay }}
              </el-form-item>
              <el-form-item label="押金">
                {{ refundForm.deposit }}
              </el-form-item>
              <el-form-item label="剩余电数" prop="electricNum">
                <el-input v-model="refundForm.electricNum" placeholder="剩余电数" style="width: 212px"
                          @blur="electricNumBlur"></el-input>
              </el-form-item>
              <el-form-item label="结余电费">
                {{isEmpty(refundForm.electricNum)?0:this.numMul(refundForm.electricNum,1.4)}}
              </el-form-item>
              <el-form-item label="水表吨数" prop="waterNum">
                <el-input v-model="refundForm.waterNum" placeholder="水表吨数"
                          style="width: 212px"></el-input>
              </el-form-item>
              <el-form-item label="使用吨数" prop="useWaterNum">
                <el-input v-model="refundForm.useWaterNum" placeholder="使用吨数" style="width: 212px"
                          @blur="useWaterNumBlur"></el-input>
              </el-form-item>
              <el-form-item label="缴纳水费">
                {{isEmpty(refundForm.useWaterNum)?0:this.numMul(refundForm.useWaterNum,7)}}
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="退费途径" name="first">
              <el-form-item label="退款方式" prop="refundPayType">
                <el-select v-model="refundForm.refundPayType" clearable placeholder="退款方式"
                           @change="refundPayTypeChange">
                  <el-option v-for="item in refendPayTypeMap" :key="item.id" :label="item.key"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="银行" v-if="refundForm.refundPayType==='3'">
                <el-input v-model="refundForm.bank" placeholder="银行"
                          style="width: 212px"></el-input>
              </el-form-item>
              <el-form-item label="开户行" v-if="refundForm.refundPayType==='3'">
                <el-input v-model="refundForm.bankAddress" placeholder="开户行"
                          style="width: 212px"></el-input>
              </el-form-item>
              <el-form-item label="银行卡号" v-if="refundForm.refundPayType==='3'">
                <el-input v-model="refundForm.bankNo" placeholder="银行卡号"
                          style="width: 212px"></el-input>
              </el-form-item>
              <el-form-item label="支付宝账号" v-if="refundForm.refundPayType==='2'">
                <el-input v-model="refundForm.alipayNo" placeholder="支付宝账号"
                          style="width: 212px"></el-input>
              </el-form-item>
              <el-form-item label="微信账号" v-if="refundForm.refundPayType==='1'">
                <el-input v-model="refundForm.wechatNo" placeholder="微信账号"
                          style="width: 212px"></el-input>
              </el-form-item>
              <el-form-item label="结转房间" v-if="refundForm.refundPayType==='4'">
                <el-select v-model="refundForm.carryRoomId" filterable clearable placeholder="结转房间">
                  <el-option v-for="item in vacantRoom" :key="item.id" :label="item.roomNum"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
      </el-row>
      <el-tabs value="first">
        <el-tab-pane label="设备/装修损坏信息" name="first">
          <el-row v-for="(item,index) in refundForm.damageArr" :key="index">
            <el-form ref="costForm" :model="item" :rules="costRules">
              <el-col :span="6">
                <el-form-item label="损坏名称">
                  <el-input v-model="item.damageName" placeholder="损坏内容" style="width: 212px"
                            @blur="costBlur(item,'damage')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="金额" prop="damageMoney">
                  <el-input v-model.number="item.damageMoney" placeholder="金额"
                            style="width: 212px" @blur="costBlur(item,'damage')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="index+1 === refundForm.damageArr.length">
                <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addDamage"
                           style="margin-left: 5px"></el-button>
                <el-button type="primary" icon="el-icon-minus" size="mini" circle
                           @click="removeDamage(index)" style="margin-left: 5px"></el-button>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-tabs value="first">
        <el-tab-pane label="其他费用" name="first">
          <el-row v-for="(item,index) in refundForm.otherCost" :key="index">
            <el-form ref="costForm" :model="item" :rules="costRules">
              <el-col :span="6">
                <el-form-item label="费用名称">
                  <el-input v-model="item.otherName" placeholder="损坏内容" style="width: 212px"
                            @blur="costBlur(item,'other')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="金额" prop="otherMoney">
                  <el-input v-model.number="item.otherMoney" placeholder="金额" style="width: 212px"
                            @blur="costBlur(item,'other')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="index+1 === refundForm.otherCost.length">
                <el-button type="primary" icon="el-icon-plus" size="mini" circle
                           @click="addOtherCost" style="margin-left: 5px"></el-button>
                <el-button type="primary" icon="el-icon-minus" size="mini" circle
                           @click="removeOtherCost(index)" style="margin-left: 5px"></el-button>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-tabs value="first">
        <el-tab-pane label="退费结算明细" name="first">
          <el-table :data="refundForm.refundDetail" style="width: 100%">
            <el-table-column prop="subject" label="科目"></el-table-column>
            <el-table-column prop="price" label="金额（元）"></el-table-column>
          </el-table>
          <el-divider content-position="right"><h1>退款合计：{{refundTotalFee}}</h1></el-divider>
          <el-divider></el-divider>
          <div>{{refundForm}}</div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "CheckOut",
    created() {
      this.queryEnterRoom()
    },
    data(){
      const checkCostMoney = (rule, value, callback) => {
        if (typeof value == "undefined" || value == null || value == "") callback()
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback()
          }
        }, 10);
      }
      return{
        enterRoom:{},
        vacantRoom:{},
        refundForm: {'damageArr': [{'id': 0}],'otherCost': [{'id': 0}],'rentEnd': '','rentRefundDate': new Date(),'refundDetail': [],'totalFee': 0,'waterNum': 0},
        rules: {
          refundPayType: [
            {required: true, message: '请选择退款方式', trigger: 'change'}
          ],
          checkOutType: [
            {required: true, message: '请选择退租类型', trigger: 'change'}
          ],
          electricNum: [
            {required: true, message: '请输入结余电数', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          waterNum: [
            {required: true, message: '请输入水表吨数', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          useWaterNum: [
            {required: true, message: '请输入使用吨数', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ]
        },
        costRules: {
          damageMoney: [
            {validator: checkCostMoney, trigger: 'blur'}
          ],
          otherMoney: [
            {validator: checkCostMoney, trigger: 'blur'}
          ]
        },
        refendStatusMap: [{'key': '到期退租', 'value': '2'}, {'key': '违约退租', 'value': '3'}, {'key': '提前退租','value': '4'}],
        refendPayTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {'key': '银行卡','value': '3'}, {'key': '转房结转', 'value': '4'}]
      }
    },
    computed: {
      refundTotalFee: function () {
        const mulNum = 10000;
        let totalFee = 0
        for (const item of this.refundForm.refundDetail) {
          const totalFeeMul = (parseFloat(totalFee) * mulNum) + (parseFloat(item.price) * mulNum)
          totalFee = totalFeeMul / mulNum
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.refundForm.totalFee = totalFee
        return totalFee
      }
    },
    methods:{
      queryEnterRoom() {
        this.$http.post(pixUrl + '/room/queryRoomByStatus', {'status':'2'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.enterRoom = result.result
          }
        }, function () {
          console.log('By房间状态请求失败');
        });
      },
      queryVacantrRoom() {
        this.$http.post(pixUrl + '/room/queryRoomByStatus', {'status': '1'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.vacantRoom = result.result
          }
        }, function () {
          console.log('By房间状态请求失败');
        });
      },
      saveCheckOut() {
        let thiz = this
        this.$refs['refundForm'].validate((valid) => {
          if (valid) {
            let validFlag = true
            for (const item of thiz.$refs['costForm']) {
              item.validate((valid1) => {
                validFlag = validFlag && valid1
              })
            }
            setTimeout(() => {
              if (validFlag) {
                //alert(123)
                this.$http.post(pixUrl + '/integration/checkOut', this.refundForm).then(function (res) {
                  const result = res.body;
                  if (result.ok) {
                    this.$notify({
                      title: '提醒',
                      message: result.message,
                      type: 'success',
                      duration: 1500,
                      offset: 100,
                      onClose: () => {
                        this.roomStatusChange();
                        this.refundForm = JSON.parse(JSON.stringify(this.refundFormBak));
                        this.showCheckOut = false
                      }
                    });
                  }
                }, function () {
                  console.log('退房请求失败');
                });
              }
            }, 1000)
          }
        })
      },
      checkOutTypeChange() {
        //删除租房类型退款数据
        this.deleteRefundDetail('押金','违约押金','结余房租');

        if (this.refundForm.checkOutType === '2') {
          this.refundForm.refundDetail.unshift({'subject': '押金','price': this.refundForm.deposit})
        } else if (this.refundForm.checkOutType === '3') {
          this.refundForm.refundDetail.unshift({'subject': '违约押金', 'price': 0})
        } else if (this.refundForm.checkOutType === '4') {
          const dayTotalFee = parseInt(this.refundForm.noLiveDay) * parseFloat(this.refundForm.dayPrice)
          this.refundForm.refundDetail.unshift({'subject': '结余房租', 'price': dayTotalFee})
        }
      },
      electricNumBlur() {
        if (this.refundForm.refundDetail.length > 0) {
          this.deleteRefundDetail('结余电费');
        }
        if (!this.isEmpty(this.refundForm.electricNum)) {
          this.refundForm.refundDetail.push({
            'flag': false,
            'subject': '结余电费',
            'price': this.numMul(parseFloat(this.refundForm.electricNum), 1.4)
          })
        }
      },
      useWaterNumBlur() {
        if (this.refundForm.refundDetail.length > 0) {
          this.deleteRefundDetail('使用水费');
        }
        if (!this.isEmpty(this.refundForm.useWaterNum)) {
          this.refundForm.refundDetail.push({
            'flag': false,
            'subject': '使用水费',
            'price': this.numMul(this.refundForm.useWaterNum, -7)
          })
        }
      },
      refundPayTypeChange() {
        this.refundForm.alipayNo = ''
        this.refundForm.wechatNo = ''
        this.refundForm.bank = ''
        this.refundForm.bankAddress = ''
        this.refundForm.bankNo = ''
        //删除换房费
        if (this.refundForm.refundDetail.length > 0) {
          this.deleteRefundDetail('换房费');
        }
        if (this.refundForm.refundPayType === '2') {
          this.refundForm.alipayNo = this.refundForm.customerMobile
        } else if (this.refundForm.refundPayType === '1') {
          this.refundForm.wechatNo = this.refundForm.customerMobile
        } else if (this.refundForm.refundPayType === '4') {
          this.queryVacantrRoom();
          this.refundForm.refundDetail.push({'subject': '换房费', 'price': -500})
        }
      },
      roomChange(){

      },
      deleteRefundDetail(value1,value2,value3){
        let index = -1
        for (let i = 0; i < this.refundForm.refundDetail.length; i++) {
          let value = this.refundForm.refundDetail[i]
          if (value.subject === value1
              || value.subject === value2
              || value.subject === value3) {
            index = i
            break;
          }
        }
        if (index != -1) this.refundForm.refundDetail.splice(index, 1);
      },
      addDamage() {
        this.refundForm.damageArr.push({'id': this.refundForm.damageArr.length});
      },
      removeDamage(index) {
        if (this.refundForm.damageArr.length == 1) {
          this.refundForm.damageArr[index].damageName = ''
          this.refundForm.damageArr[index].damageMoney = ''
          this.removeRefundDetailItem('damage', index)
          return;
        }
        this.refundForm.damageArr.splice(index, 1);
        this.removeRefundDetailItem('damage', index)
      },
      addOtherCost() {
        this.refundForm.otherCost.push({'id': this.refundForm.otherCost.length});
      },
      removeOtherCost(index) {
        if (this.refundForm.otherCost.length == 1) {
          this.refundForm.otherCost[index].otherName = ''
          this.refundForm.otherCost[index].otherMoney = ''
          this.removeRefundDetailItem('other', index)
          return;
        }
        this.refundForm.otherCost.splice(index, 1);
        this.removeRefundDetailItem('other', index)
      },
      isEmpty(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
        }
      },
      numMul(x, y) {
        const multipleNum = 10000
        x = x * multipleNum
        y = y * multipleNum
        return x * y / multipleNum / multipleNum
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