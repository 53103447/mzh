<template>
  <div class="hello">
    <el-row type="flex" class="row-bg">
      <el-col :span="24">
        房态：<el-select v-model="roomStatus" clearable placeholder="请选择" @change="roomStatusChange">
          <el-option
                  v-for="(key,value) in roomStatusArr"
                  :key="key"
                  :label="value"
                  :value="key">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane v-for="item in roomFloor" :key="item" :label="item+'楼'" :name="item" >
        <el-button v-for="roomItem in room" :key="roomItem.id" :type="roomItem.showCss"
                   :icon="roomItem.status == '6'?'el-icon-check':roomItem.status == '2'?'el-icon-circle-check':''"
        @click="toDetail(roomItem)">{{roomItem.roomNum}}</el-button>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="入住登记" :visible.sync="showRoom" :fullscreen="true">
      <el-form :model="roomForm" :rules="rules" label-position="right" label-width="110px">
        <el-row>
          <el-col :span="6">
            <el-tabs value="first">
              <el-tab-pane label="租房信息" name="first">
                <el-form-item label="房间号">
                  {{roomForm.roomNum}}
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
                  <el-input v-model="roomForm.customerName" placeholder="租客姓名" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" prop="cardType">
                  <el-select v-model="roomForm.cardType" clearable placeholder="证件类型">
                      <el-option label="身份证" value="1"></el-option>
                      <el-option label="其他" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证件号" prop="cardNo">
                  <el-input v-model="roomForm.cardNo" placeholder="证件号" style="width: 217px"></el-input>
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
                  <el-input v-model="roomForm.mobilePhone" placeholder="手机号" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="户籍地址" prop="permanentAddress">
                  <el-input v-model="roomForm.permanentAddress" type="textarea" :rows="3" placeholder="户籍地址" style="width: 217px"></el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-col><el-col :span="2">1</el-col>
          <el-col :span="6">
            <el-tabs value="first">
              <el-tab-pane label="合住人与紧急联系人" name="first">
                <div v-for="item in roomForm.cohabitant" :key="item.id">
                  <el-form-item label="同住人姓名">
                    <el-input v-model="item.customerName" placeholder="同住人姓名" style="width: 217px"></el-input>
                    <el-button type="primary" icon="el-icon-delete" size="mini" circle @click="deleteCohabitant(item)" style="margin-left: 5px"></el-button>
                  </el-form-item>
                  <el-form-item label="证件类型">
                    <el-select v-model="item.cardType" clearable placeholder="证件类型">
                      <el-option label="身份证" value="1"></el-option>
                      <el-option label="其他" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="证件号">
                    <el-input v-model="item.cardNo" placeholder="证件号" style="width: 217px"></el-input>
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
                    <el-input v-model="item.mobilePhone" placeholder="手机号" style="width: 217px"></el-input>
                  </el-form-item>
                  <el-form-item label="户籍地址">
                    <el-input v-model="item.permanentAddress" type="textarea" :rows="3" placeholder="户籍地址" style="width: 217px"></el-input>
                  </el-form-item>
                </div>
                <el-row type="flex" justify="center">
                  <el-col :span="24" style="text-align: center">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addCohabitant">新增同住人</el-button>
                  </el-col>
                </el-row><br/>
                <el-form-item label="紧急联系人" prop="urgentPeople">
                  <el-input v-model="roomForm.urgentPeople" placeholder="紧急联系人" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机" prop="urgentPhone">
                  <el-input v-model="roomForm.urgentPhone" placeholder="联系人手机" style="width: 217px"></el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-col><el-col :span="2">1</el-col>
          <el-col :span="6">
            <el-tabs value="first">
              <el-tab-pane label="房租费用" name="first">
                <el-form-item label="预订号码">
                <el-input v-model="reserveMobile" placeholder="预订号码" style="width: 217px"></el-input>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="deleteCohabitant(item)" style="margin-left: 5px">查询</el-button>
              </el-form-item>
                <el-form-item label="预订信息">
                  订金：{{reserve.price}}，有效期至：{{reserve.effectiveTime}}
                </el-form-item>
                <el-form-item label="官方房价">
                  {{roomForm.originalPrice}}
                </el-form-item>
                <el-form-item label="成交房价" prop="realPrice">
                  <el-input v-model="roomForm.realPrice" placeholder="成交房价" style="width: 217px" @blur="realPriceChange"></el-input>
                </el-form-item>
                <el-form-item label="押金">
                  <el-input v-model="roomForm.realPrice" placeholder="押金" :disabled="true" style="width: 217px"></el-input>
                </el-form-item>

                <el-form-item label="当前水表数">
                  <el-input v-model="roomForm.waterNum" placeholder="当前水表数" style="width: 217px"></el-input>
                </el-form-item>

                <el-form-item label="销售员" prop="saleId">
                  <!-- 这里应该是个select，自己员工表中的人，加上分销团队名 -->
                  <el-select v-model="roomForm.saleId" clearable placeholder="销售员">
                    <el-option v-for="item in saleUser" :key="item.id" :label="item.userName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="费用合计">
                  {{totalFee}}
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-col><el-col :span="2"></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
export default {
  name: 'HelloWorld',
  created(){
    this.queryRoomFloor();
    this.queryRoomByFloor();
    this.queryRoomStatus();
    this.queryUserByStatus();
  },
  data: function() {
    return {
      activeName:"1",
      roomFloor:[],
      room:[],
      roomStatusArr:[],
      roomStatus:'',
      showRoom:true,
      reserveMobile:'',
      totalFee:0,
      saleUser:[],
      reserve:{'price':500,'effectiveTime':'2020-03-01'},
      roomForm:{'contractMonthNum':1,cohabitant:[{'id':1}]},
      pickerDisableOptions: {
        disabledDate(time) {
          const tomorrow = Date.now()
          return time.getTime() < tomorrow;
        },
      },
      rules: {
        customerName: [
          { required: true, message: '请输入租房姓名', trigger: 'blur' },
        ],
        cardType: [
          { type: 'date', required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        cardNo: [
          { required: true, message: '请输入证件号', trigger: 'blur' },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ],
        mobilePhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        permanentAddress: [
          { required: true, message: '请输入户籍地址', trigger: 'blur' },
        ],
        urgentPeople: [
          { required: true, message: '请输入紧急联系人', trigger: 'blur' },
        ],
        urgentPhone: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' },
        ],
        realPrice: [
          { required: true, message: '请输入成交房价', trigger: 'blur' },
        ],
        saleId: [
          { required: true, message: '请选择销售员', trigger: 'change' }
        ],
        contractStart: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        cardEffective: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  computed:{
    contractEnd:function(){
      const result = this.getNextMonth(this.roomForm.contractStart,this.roomForm.contractMonthNum)
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.roomForm.contractEnd = result
      return result;
    }
  },
  methods:{
    queryRoomFloor(){
      this.$http.post(pixUrl+'/room/queryRoomFloor',{}).then(function(res){
        this.roomFloor = res.body
      },function(){
        console.log('请求失败处理');
      });
    },
    queryRoomByFloor(){
      this.$http.post(pixUrl+'/room/queryRoomByFloor',{'floor' : this.activeName }).then(function(res){
        this.room = res.body
      },function(){
        console.log('请求失败处理');
      });
    },
    queryRoomStatus(){
      this.$http.post(pixUrl+'/room/queryRoomStatus',{}).then(function(res){
        this.roomStatusArr = res.body
      },function(){
        console.log('请求失败处理');
      });
    },
    queryRoomByStatus(){
      this.$http.post(pixUrl+'/room/queryRoomByStatus',{'status':this.roomStatus}).then(function(res){
        this.room = res.body
      },function(){
        console.log('请求失败处理');
      });
    },
    queryUserByStatus(){
      this.$http.post(pixUrl+'/user/queryUserByStatus',{'status':'1'}).then(function(res){
        this.saleUser = res.body
      },function(){
        console.log('请求失败处理');
      });
    },
    toDetail(roomItem){
      this.roomForm.roomNum = roomItem.roomNum;
      this.roomForm.originalPrice = roomItem.price;
      this.roomForm.waterNum = roomItem.waterNum;
      this.showRoom = true;
    },
    tabChange(){
      if(this.activeName === '整'){
        this.roomStatusChange();
        return;
      }
      this.queryRoomByFloor();
    },
    roomStatusChange(){
      if(this.isEmpty(this.roomStatus)){
        this.activeName = '1'
        this.queryRoomFloor();
        this.queryRoomByFloor();
      }else{
        this.roomFloor=['整']
        this.activeName = '整'
        this.queryRoomByStatus();
      }
    },
    addCohabitant(){
      this.roomForm.cohabitant.push({'id':this.roomForm.cohabitant.length+1});
    },
    deleteCohabitant(item){
      if(this.roomForm.cohabitant.length==1) return;
      let index = -1
      for(let i=0;i++;i<this.roomForm.cohabitant.length){
        index = i
        let value = this.roomForm.cohabitant[i]
        if(item.id === value.id){
          break;
        }
      }
      this.roomForm.cohabitant.splice(index,1);
    },
    realPriceChange(){
      if(this.isEmpty(this.roomForm.realPrice)) return 0.00
      let totalFee = this.roomForm.realPrice*2
      let reservePrice = this.isEmpty(this.reserve.price)?0:this.reserve.price
      totalFee = totalFee - reservePrice
      this.totalFee = totalFee
    },
    isEmpty(obj){
      if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
      }else{
        return false;
      }
    },
    getNextMonth(date,addMonth) {
      if(this.isEmpty(date)) return ''
      let year = date.getFullYear(); //获取当前日期的年份
      let month = date.getMonth()+1; //获取当前日期的月份
      let day = date.getDate(); //获取当前日期的日
      let year2 = year;
      let month2 = parseInt(month) + addMonth;
      if (month2 > 12) {
        year2 = parseInt(year2) + 1;
        month2 = month2-12;
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
  }
}
</script>

<style scoped>

</style>
