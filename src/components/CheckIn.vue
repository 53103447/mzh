<template>
  <div>
    <el-row type="flex" justify="end" align="middle">
      <el-col :span="24" style="padding: 15px;">
        <el-button type="primary" @click="saveCheckIn">保 存</el-button>
      </el-col>
    </el-row>
    <el-form :model="roomForm" :rules="rules" ref="roomForm" label-position="right" label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="租房信息" name="first">
              <el-form-item label="房间号">
                <el-select v-model="roomForm.roomId" filterable placeholder="请选择入住房间" @change="roomChange">
                  <el-option v-for="item in vacantRoom" :key="item.id" :label="item.roomNum" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同期限">
                <el-input-number v-model="roomForm.contractMonthNum" :min="1" :max="12"></el-input-number>
              </el-form-item>
              <el-form-item label="合同开始日期" prop="contractStart">
                <el-date-picker
                        v-model="roomForm.contractStart"
                        type="date"
                        :picker-options="pickerDisableOptions"
                        placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="合同结束日期">
                {{contractEnd}}
              </el-form-item>
              <el-form-item label="租客姓名" prop="customerName">
                <el-input v-model="roomForm.customerName" placeholder="租客姓名"
                          style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="证件类型" prop="cardType">
                <el-select v-model="roomForm.cardType" @change="cardTypeChange" clearable
                           placeholder="证件类型">
                  <el-option label="身份证" value="1"></el-option>
                  <el-option label="其他" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号" prop="cardNo">
                <el-input v-model="roomForm.cardNo" placeholder="证件号" maxlength="18"
                          style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="证件有效期" prop="cardEffective">
                <el-date-picker
                        v-model="roomForm.cardEffective"
                        type="date"
                        :picker-options="pickerDisableOptions"
                        placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio v-model="roomForm.sex" label="M">男</el-radio>
                <el-radio v-model="roomForm.sex" label="F">女</el-radio>
              </el-form-item>
              <el-form-item label="手机号" prop="mobilePhone">
                <el-input v-model="roomForm.mobilePhone" maxlength="11" placeholder="手机号"
                          style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="户籍地址" prop="permanentAddress">
                <el-input v-model="roomForm.permanentAddress" type="textarea" :rows="3"
                          placeholder="户籍地址" style="width: 217px"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="合住人与紧急联系人" name="first">
              <div v-for="(item,index) in roomForm.cohabitant" :key="item.id">
                <el-form-item label="同住人姓名">
                  <el-input v-model="item.name" placeholder="同住人姓名"
                            style="width: 217px"></el-input>
                  <el-button type="primary" icon="el-icon-delete" size="mini" circle
                             @click="deleteCohabitant(index)"
                             style="margin-left: 5px"></el-button>
                </el-form-item>
                <el-form-item label="证件类型">
                  <el-select v-model="item.cardType" @change="sharingCardTypeChange(item)"
                             clearable placeholder="证件类型">
                    <el-option label="身份证" value="1"></el-option>
                    <el-option label="其他" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证件号" prop="sharingCardNo">
                  <el-input v-model="item.cardNo" placeholder="证件号" maxlength="18"
                            style="width: 217px"></el-input>
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
                  <el-input v-model="item.mobilePhone" maxlength="11" placeholder="手机号"
                            style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="户籍地址">
                  <el-input v-model="item.permanentAddress" type="textarea" :rows="3"
                            placeholder="户籍地址" style="width: 217px"></el-input>
                </el-form-item>
              </div>
              <el-row type="flex" justify="center">
                <el-col :span="24" style="text-align: center">
                  <el-button type="primary" icon="el-icon-circle-plus-outline"
                             @click="addCohabitant">新增同住人
                  </el-button>
                </el-col>
              </el-row>
              <br/>
              <el-form-item label="紧急联系人" prop="urgentPeople">
                <el-input v-model="roomForm.urgentPeople" placeholder="紧急联系人"
                          style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="联系人手机号" prop="urgentPhone">
                <el-input v-model="roomForm.urgentPhone" placeholder="联系人手机" maxlength="11"
                          style="width: 217px"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">1</el-col>
        <el-col :span="6">
          <el-tabs value="first">
            <el-tab-pane label="房租费用" name="first">
              <el-form-item label="预订信息" v-if="!isEmpty(reserve.reservePrice)">
                订金：{{reserve.reservePrice}}，有效期至：{{reserve.effectiveTime | formatDate }}
              </el-form-item>
              <el-form-item label="官方房价">
                {{roomForm.originalPrice}}
              </el-form-item>
              <el-form-item label="成交房价" prop="realPrice">
                <el-input v-model="roomForm.realPrice" placeholder="成交房价" maxlength="4"
                          style="width: 217px" @blur="realPriceChange()"></el-input>
              </el-form-item>
              <el-form-item label="押金">
                <el-input v-model="roomForm.realPrice" placeholder="押金" :disabled="true"
                          style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="收款方式" prop="payType">
                <!-- 这里应该是个select，自己员工表中的人，加上分销团队名 -->
                <el-select v-model="roomForm.payType" clearable placeholder="支付方式">
                  <el-option v-for="item in payTypeMap" :key="item.id" :label="item.key"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="当前水表数">
                <el-input v-model="roomForm.waterNum" placeholder="当前水表数"
                          style="width: 217px"></el-input>
              </el-form-item>

              <el-form-item label="销售员" prop="saleId">
                <!-- 这里应该是个select，自己员工表中的人，加上分销团队名 -->
                <el-select v-model="roomForm.saleId" clearable placeholder="销售员">
                  <el-option v-for="item in saleUser" :key="item.id" :label="item.userName"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="roomForm.remark" placeholder="备注"
                          style="width: 217px"></el-input>
              </el-form-item>
              <el-form-item label="是否换房">
                <el-checkbox v-model="roomForm.isForward" @change="forwardChange">是</el-checkbox>
              </el-form-item>
              <el-form-item label="换房结转单" v-if="roomForm.isForward">
                <el-select v-model="roomForm.settlementId" clearable placeholder="销售员" @change="selectSettlementById">
                  <el-option v-for="item in forwardList" :key="item.id" :label="item.roomNum+'结转单'"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结转单金额" v-if="roomForm.isForward">
                {{roomForm.forwarTotal}}
              </el-form-item>
              <el-form-item label="费用合计">
                {{roomForm.totalFee}}
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
    name: "CheckIn",
    created() {
      this.queryRoomByStatus();
      this.queryUserByStatus();

    },
    data() {
      return {
        roomForm: {'contractMonthNum': 1, cohabitant: [{'abc': 1}],'originalPrice':0, 'totalFee': 0},
        rules: {
          customerName: [
            {required: true, message: '请输入租房姓名', trigger: 'blur'},
          ],
          cardType: [
            {required: true, message: '请选择证件类型', trigger: 'change'}
          ],
          cardNo: [
            {required: true, message: '请输入证件号', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
          mobilePhone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: '^1[0-9]{10}$', message: '手机号格式不正确', trigger: 'blur'},
          ],
          sharingCardNo: [
            {
              pattern: '^[1-9]\\d{5}(18|19|20|(3\\d))\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
              message: '身份证号格式不正确',
              trigger: 'blur',
              flag: 'cardNoValid'
            }
          ],
          permanentAddress: [
            {required: true, message: '请输入户籍地址', trigger: 'blur'},
          ],
          urgentPeople: [
            {required: true, message: '请输入紧急联系人', trigger: 'blur'},
          ],
          urgentPhone: [
            {required: true, message: '请输入联系人手机号', trigger: 'blur'},
            {pattern: '^1[0-9]{10}$', message: '手机号格式不正确', trigger: 'blur'},
          ],
          realPrice: [
            {required: true, message: '请输入成交房价', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          payType: [
            {required: true, message: '请选择收款方式', trigger: 'change'}
          ],
          saleId: [
            {required: true, message: '请选择销售员', trigger: 'change'}
          ],
          contractStart: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          cardEffective: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ]
        },
        pickerDisableOptions: {
          disabledDate(time) {
            const tomorrow = Date.now()
            return time.getTime() < tomorrow;
          },
        },
        reserve: {},
        payTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {'key': 'POS机','value': '3'}, {'key': '现金', 'value': '4'}],
        saleUser: [],
        vacantRoom:[],
        isForward:false,
        forwardList:[],
        selectForward:{}
      }
    },
    computed: {
      contractEnd: function () {
        const result = this.getNextMonth(this.roomForm.contractStart, this.roomForm.contractMonthNum)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.roomForm.contractEnd = new Date(result)
        return result;
      }
    },
    methods: {
      queryRoomByStatus() {
        this.$http.post(pixUrl + '/room/queryRoomByStatus', {'status':'1,6'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.vacantRoom = result.result
          }
        }, function () {
          console.log('By房间状态请求失败');
        });
      },
      queryRoomById(roomId) {
        this.$http.post(pixUrl + '/room/queryRoomByStatus', {'id':roomId}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            const res = result.result[0]
            this.roomForm.originalPrice = res.price
            this.roomForm.waterNum = res.waterNum
          }
        }, function () {
          console.log('根据ID查询房间失败');
        });
      },
      queryUserByStatus() {
        this.$http.post(pixUrl + '/user/queryUserByStatus', {'status': '1'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.saleUser = res.body.result;
          }
        }, function () {
          console.log('查询销售员失败');
        });
      },
      queryReserve(roomId) {
        this.$http.post(pixUrl + '/reserve/queryReserveByMobile', {'roomId': roomId}).then(function (res) {
          this.reserve = res.body
          this.roomForm.reserveId = this.reserve.id;
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      selectSettlementById(){
        this.$http.post(pixUrl + '/settlement/selectSettlementById', {'id': this.roomForm.settlementId}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.roomForm.forwarTotal = result.result.totalFee;
            this.roomForm.totalFee = this.roomForm.totalFee - result.result.totalFee;
          }
        }, function () {
          console.log('查询销售员失败');
        });
      },
      saveCheckIn() {
        this.$refs['roomForm'].validate((valid) => {
          if (valid) {
            this.$http.post(pixUrl + '/integration/checkIn', this.roomForm).then(function (res) {
              const result = res.body;
              if (result.ok) {
                this.$notify({
                  title: '提醒',
                  message: result.message,
                  type: 'success',
                  duration: 1500,
                  offset: 100,
                  onClose: () => {
                    // this.roomStatusChange(); 跳转房态页面
                    this.roomForm = {};
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
        });
      },
      addCohabitant() {
        this.roomForm.cohabitant.push({'id': this.roomForm.cohabitant.length + 1});
      },
      deleteCohabitant(index) {
        this.roomForm.cohabitant.splice(index, 1);
      },
      roomChange(){
        this.queryRoomById(this.roomForm.roomId);
        this.queryReserve(this.roomForm.roomId);
      },
      cardTypeChange() {
        if (this.roomForm.cardType === '1') {
          this.rules.cardNo.push({
            pattern: '^[1-9]\\d{5}(18|19|20|(3\\d))\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
            message: '身份证号格式不正确',
            trigger: 'blur',
            flag: 'cardNoValid'
          })
        } else {
          let item = ''
          for (let value in this.rules.cardNo) {
            if (value.flag === 'cardNoValid') item = value
          }
          let index = this.rules.cardNo.indexOf(item)
          this.rules.cardNo.splice(index, 1)
        }
      },
      realPriceChange() {
        if (this.isEmpty(this.roomForm.realPrice)) return 0.00
        let totalFee = this.roomForm.realPrice * 2
        let reservePrice = this.isEmpty(this.reserve.reservePrice) ? 0 : this.reserve.reservePrice;
        //totalFee = totalFee - reservePrice
        this.roomForm.totalFee = totalFee - reservePrice
      },
      forwardChange(){
        if(this.roomForm.isForward){
          this.$http.post(pixUrl + '/settlement/selectSettlementByStatus', {}).then(function (res) {
            const result = res.body;
            if (result.ok) {
              this.forwardList = result.result
            }
          }, function () {
            console.log('根据ID查询房间失败');
          });
        }
      },
      isEmpty(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
        }
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
      },
      formatTimer: function (value) {
        if (typeof value == "undefined" || value == null || value == "") return ''
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        let h = date.getHours();
        h = h < 10 ? "0" + h : h;
        let m = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        let s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
      }
    }
  }
</script>

<style scoped>

</style>
