<template>
  <div class="hello">
    <el-row type="flex" class="row-bg" justify="center" align="middle">
      <el-col :span="4">
        房态：
        <el-select v-model="searchParam.status" clearable placeholder="请选择" @change="roomStatusChange">
          <el-option
                  v-for="(key,value) in roomStatusArr"
                  :key="key"
                  :label="value"
                  :value="key">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="20">
        房间号：
        <el-input v-model="searchParam.roomNum" @input="roomStatusChange" placeholder="房间号"
                  style="width: 217px"></el-input>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane v-for="item in roomFloor" :key="item" :label="item+'楼'" :name="item">
        <h5 v-if="room==null || room.length<1">当前暂无数据</h5>
        <div>
          <el-button v-for="roomItem in room" :key="roomItem.id" :type="roomItem.showCss"
                     :icon="roomItem.status == '6'?'el-icon-check':roomItem.status == '2'?'el-icon-circle-check':''"
                     @click="toDetail(roomItem)" style="margin:10px">{{roomItem.roomNum}}{{roomItem.style}}
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="24">
        <el-button size="mini">空房</el-button>
        <el-button size="mini" type="success" icon="el-icon-circle-check">已出租</el-button>
        <el-button size="mini" type="warning">脏房</el-button>
        <el-button size="mini" type="danger">维修</el-button>
        <el-button size="mini" type="info">员工房</el-button>
        <el-button size="mini" type="primary" icon="el-icon-check">已预定</el-button>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="roomDialog" width="60%">
      <div slot="title">
        <el-row type="flex" class="row-bg" justify="center" align="middle">
          <el-col :span="12">
            <h2>房间信息</h2>
          </el-col>
          <el-col :span="12" :offset="roomInfo.room.status!='1'?18:14">
            <el-button type="warning" @click="showReserve = true" v-if="roomInfo.room.status==='1'">预订</el-button>
            <el-button type="info" @click="showStaff = true;queryUserByStatus()" v-if="roomInfo.room.status==='1'">员工入住</el-button>
            <el-popconfirm title="确认该房间已打扫吗？" @confirm="updateRoomStatus" v-if="roomInfo.room.status==='3'">
              <el-button slot="reference" type="primary">已打扫</el-button>
            </el-popconfirm>
            <el-popconfirm title="确认该房间已打扫吗？" @confirm="staffCheckOut" v-if="roomInfo.room.status==='5'">
              <el-button type="danger">员工退房</el-button>
            </el-popconfirm>
          </el-col>
        </el-row>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>房间信息</span>
        </div>
        <el-row style="font-size: 16px">
          <el-col :span="6">房间号：{{roomInfo.room.roomNum}}</el-col>
          <el-col :span="6">户型：{{roomInfo.room.style}}<el-input v-model="roomStyle" placeholder="请输入内容"></el-input><el-button size="mini" @click="saveRoomStyle">保存</el-button></el-col>
          <el-col :span="6">价格：{{roomInfo.room.price}}元</el-col>
          <el-col :span="6">水表数：{{roomInfo.room.waterNum}}吨</el-col>
        </el-row><br/>
        <el-table :data="roomInfo.room.facilitiesArr" align="center" border style="width: 100%" size="small">
          <el-table-column prop="name" label="设备名称"></el-table-column>
          <el-table-column prop="price" label="设备价值"></el-table-column>
        </el-table>
      </el-card><br/>
      <el-card class="box-card" v-if="!isEmpty(roomInfo.customers)">
        <div slot="header" class="clearfix">
          <span>居住人信息</span>
        </div>
        <el-table :data="roomInfo.customers" border style="width: 100%">
          <el-table-column label="客户类型">
            <template slot-scope="scope">
              {{scope.$index==0?'签约人':'同住人' }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="客户姓名"></el-table-column>
          <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
          <el-table-column prop="urgentPeople" label="紧急联系人"></el-table-column>
          <el-table-column prop="urgentPhone" label="联系人手机"></el-table-column>
          <el-table-column prop="permanentAddress" label="户籍地址" width="200"></el-table-column>
        </el-table>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="roomDialog = false">关 闭</el-button>
      </span>

      <!-- 房间预订 -->
      <el-dialog title="房间预订" :visible.sync="showReserve" :show-close="false" width="30%" append-to-body>
        <el-form ref="reserveForm" :model="reserveForm" :rules="rules" label-width="110px">
          <el-form-item label="房间号">
            {{reserveForm.roomNum}}
          </el-form-item>
          <el-form-item label="预订手机号" prop="reserveMobile">
            <el-input v-model="reserveForm.reserveMobile" placeholder="预订手机号" maxlength="11"
                      style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item label="订金金额" prop="reservePrice">
            <el-input v-model="reserveForm.reservePrice" placeholder="订金金额" maxlength="4"
                      style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item label="订金有效期" prop="effectiveTime">
            <el-date-picker
                    v-model="reserveForm.effectiveTime"
                    type="date"
                    :picker-options="pickerDisableOptions"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="支付方式" prop="payType">
            <el-select v-model="reserveForm.payType" clearable placeholder="支付方式">
              <el-option v-for="item in payTypeMap" :key="item.id" :label="item.key"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="reserveForm.remark" placeholder="备注" style="width: 217px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showReserve = false;showVacant=false">取 消</el-button>
          <el-button type="primary" @click="saveReserve">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="员工入住" :visible.sync="showStaff" width="50%" :show-close="false" append-to-body>
        <div>房间号：{{this.roomForm.roomNum}}</div>
        <br/>
        <el-transfer v-model="staffCheckIn" :data="staffCheckInDate" :titles="['未入住员工', '已入住员工']"></el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="staffCheckOut" v-if="!isEmpty(roomForm.contractId)">退 房</el-button>
          <el-button @click="showStaff = false;showVacant=false">取 消</el-button>
          <el-button type="primary" @click="saveStaffCheckIn">确 定</el-button>
        </span>
      </el-dialog>



    </el-dialog>

  </div>
</template>

<script>
  //this.$refs.ruleForm.validateField('checkPass');
  const pixUrl = "http://localhost:8096"
  export default {
    name: 'HelloWorld',
    created() {
      this.queryRoomFloor();
      this.queryRoomByFloor();
      this.queryRoomStatus();
    },
    data: function () {
      return {
        roomStyle:'',
        activeName: "1",
        roomFloor: [],
        room: [],
        vacantRoom: [],
        roomForm: {},
        reserveForm: {},
        roomStatusArr: [],
        searchParam: {},
        showEnter: false,
        showVacant: false,
        showReserve: false,
        showStaff: false,
        showReserveInfo: false,
        reserveMobile: '',
        checkInStaff: [],
        reserve: {},
        collapseItem: ['1'],
        staffCheckIn: [],
        staffCheckInDate: [],
        enterResult: {'room': {}, 'contract': {}, 'customers': []},
        payTypeSelect: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金'},
        payTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {
          'key': 'POS机',
          'value': '3'
        }, {'key': '现金', 'value': '4'}],
        rentStatusMap: {'0': '待交租', '1': '已交租', '2': '违约'},
        pickerDisableOptions: {
          disabledDate(time) {
            const tomorrow = Date.now()
            return time.getTime() < tomorrow;
          },
        },
        rules: {
          reserveMobile: [{required: true, message: '请输入预订手机号', trigger: 'blur'},
            {pattern: '^1[0-9]{10}$', message: '手机号格式不正确', trigger: 'blur'}
          ],
          reservePrice: [
            {required: true, message: '请输入预订金额', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          effectiveTime: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ]
        },
        roomDialog:false,
        roomInfo:{'room':{}}
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
    },
    methods: {
      saveRoomStyle(){
        this.$http.post(pixUrl + '/room/updateRoomStyle', {'id':this.roomInfo.room.id,'style':this.roomStyle}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.$notify({
              title: '提醒',
              message: result.message,
              type: 'success',
              duration: 500,
              offset: 100,
              onClose: () => {
                this.roomDialog=false
                this.queryRoomByFloor()
              }
            });
          }
        })
      },
      queryRoomFloor() {
        this.$http.post(pixUrl + '/room/queryRoomFloor', {}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.roomFloor = result.result
          }
        }, function () {
          console.log('楼层请求失败！');
        });
      },
      queryRoomByFloor() {
        this.$http.post(pixUrl + '/room/queryRoomByFloor', {'floor': this.activeName}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.room = result.result
          }
        }, function () {
          console.log('楼层房间请求失败');
        });
      },
      queryRoomByStatus() {
        this.$http.post(pixUrl + '/room/queryRoomByStatus', this.searchParam).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.room = result.result
          }
        }, function () {
          console.log('By房间状态请求失败');
        });
      },
      queryRoomStatus() {
        this.$http.post(pixUrl + '/room/queryRoomStatus', {}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.roomStatusArr = result.result
          }
        }, function () {
          console.log('房间状态请求失败');
        });
      },
      queryRoomInfo(roomId) {
        this.$http.post(pixUrl + '/integration/queryRoomInfo', {'roomId': roomId}).then(function (res) {
          if (res.body.ok) {
            this.enterResult = res.body.result
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      queryReserve(roomId) {
        this.$http.post(pixUrl + '/reserve/queryReserveByMobile', {'roomId': roomId}).then(function (res) {
          this.reserve = res.body
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      queryStaffRoom(roomId, roomNum) {
        this.$http.post(pixUrl + '/integration/queryStaffRoom', {
          'roomId': roomId,
          'roomNum': roomNum
        }).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.roomForm.contractId = result.result.contract.id;
            const cohabitantIdArr = result.result.contract.cohabitantId.split(",");
            for (const item in cohabitantIdArr) {
              this.staffCheckIn.push(parseInt(cohabitantIdArr[item]));
            }
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      queryUserByStatus() {
        this.$http.post(pixUrl + '/user/queryUserByStatus', {'status': '1'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            const value = result.result
            const staffArr = [];
            for (const item in value) {
              staffArr.push({key: value[item].id, label: value[item].userName})
            }
            this.staffCheckInDate = staffArr
          }
        }, function () {
          console.log('by用户状态请求失败');
        });
      },
      updateRoomStatus(roomId) {
        this.$http.post(pixUrl + '/room/updateRoomStatus', {'id': roomId, 'status': '1'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.$message({
              type: 'success',
              message: '更新成功!',
              duration: 1000,
              onClose: () => {
                this.showStaff = false;
                this.showVacant = false;
                this.roomStatusChange();
              }
            });
          }
        }, function () {
          console.log('by用户状态请求失败');
        });
      },
      saveReserve() {
        this.$refs['reserveForm'].validate((valid) => {
          if (valid) {
            this.$http.post(pixUrl + '/reserve/saveReserve', this.reserveForm).then(function (res) {
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
                    this.reserveForm = {};
                    this.showReserve = false;
                    this.showVacant = false;
                  }
                });
              } else {
                this.$notify({
                  title: '提醒',
                  message: result.message,
                  type: 'error',
                  duration: 1500,
                  offset: 100
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
      saveStaffCheckIn() {
        this.$http.post(pixUrl + '/integration/staffCheckIn', {
          'roomId': this.roomForm.roomId,
          'roomNum': this.roomForm.roomNum,
          'staffIds': this.staffCheckIn
        }).then(function (res) {
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
                this.roomForm = {};
                this.showStaff = false;
                this.showVacant = false;
              }
            });
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      staffCheckOut() {
        this.$http.post(pixUrl + '/integration/staffCheckOut', {
          'roomId': this.roomForm.roomId,
          'contractId': this.roomForm.contractId
        }).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.$notify({
              title: '提醒',
              message: result.message,
              type: 'success',
              duration: 1500,
              offset: 100,
              onClose: () => {
                //
              }
            });
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      toDetail(roomItem) {
        this.$http.post(pixUrl + '/room/selectRoomById', {'id': roomItem.id}).then(function (res) {
          if(res.body.ok){
            this.roomInfo = res.body.result
            this.roomDialog = true
          }
        }, function () {
          console.log('by手机号预定信息');
        });
        /*this.reserve = {};
        this.roomForm.reserveId = null;
        this.staffCheckIn = [];
        if ("1" === roomItem.status) {
          this.roomForm.roomId = roomItem.id;
          this.roomForm.roomNum = roomItem.roomNum;
          this.roomForm.originalPrice = roomItem.price;
          this.roomForm.waterNum = roomItem.waterNum;

          this.reserveForm.roomId = roomItem.id;
          this.reserveForm.roomNum = roomItem.roomNum;

          this.showVacant = true;
        } else if ("2" === roomItem.status) {
          this.queryRoomInfo(roomItem.id)
          this.showEnter = true
        } else if ("3" === roomItem.status) {
          this.$confirm('确认该房间已打扫，更新为空房吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateRoomStatus(roomItem.id);
          })
        } else if ("5" === roomItem.status) {
          this.showVacant = true;
          this.queryStaffRoom(roomItem.id, roomItem.roomNum);
          setTimeout(() => {
            this.roomForm.roomId = roomItem.id;
            this.roomForm.roomNum = roomItem.roomNum;
            this.showStaff = true;
          }, 10)
        } else if ("6" === roomItem.status) {
          this.queryReserve(roomItem.id)
          this.showReserveInfo = true;
        }*/
      },
      staffCheckInDataMethod() {
        let result = []
        for (const item in this.saleUser) {
          result.push({key: this.saleUser[item].id, label: this.saleUser[item].userName})
        }
        this.staffCheckInDate = result
      },
      tabChange() {
        if (this.activeName === '整') {
          this.roomStatusChange();
          return;
        }
        this.queryRoomByFloor();
      },
      roomStatusChange() {
        if (this.isEmpty(this.searchParam.status) && this.isEmpty(this.searchParam.roomNum)) {
          this.activeName = '1'
          this.queryRoomFloor();
          this.queryRoomByFloor();
        } else {
          this.roomFloor = ['整']
          this.activeName = '整'
          this.queryRoomByStatus();
        }
      },
      roomStatusClick(roomStatus) {
        this.searchParam.status = roomStatus;
        this.roomStatusChange();
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
      },
      numMul(x, y) {
        const multipleNum = 10000
        x = x * multipleNum
        y = y * multipleNum
        return x * y / multipleNum / multipleNum
      }
    }
  }
</script>

<style scoped>
  .hello .el-dialog__header {
    padding: 0px;
    padding-bottom: 0px;
    padding-left: 20px;
  }
</style>


