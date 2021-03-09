<template>
  <div>
    <div>
      <table style="width: 100%;text-align: center;padding-bottom: 10px;">
        <tr>
          <td style="width: 25%" :class="{primary:statusIndex==0,info:statusIndex!=0}" @click="selectRoomStatus(0)">全部</td>
          <td style="width: 25%" :class="{primary:statusIndex==1,info:statusIndex!=1}" @click="selectRoomStatus(1)">空房</td>
          <td style="width: 25%" :class="{primary:statusIndex==2,info:statusIndex!=2}" @click="selectRoomStatus(2)">已出租</td>
          <td style="width: 25%" :class="{primary:statusIndex==3,info:statusIndex!=3}" @click="selectRoomStatus(3)">脏房</td>
        </tr>
        <tr>
          <td style="width: 25%" :class="{primary:statusIndex==4,info:statusIndex!=4}" @click="selectRoomStatus(4)">维修</td>
          <td style="width: 25%" :class="{primary:statusIndex==5,info:statusIndex!=5}" @click="selectRoomStatus(5)">员工房</td>
          <td style="width: 25%" :class="{primary:statusIndex==6,info:statusIndex!=6}" @click="selectRoomStatus(6)">已预定</td>
        </tr>
      </table>
      <el-row type="flex" class="row-bg" justify="center" align="middle">
        <el-col :span="24">
          <el-input v-model="searchParam.roomNum" @input="inputTimeOut" prefix-icon="el-icon-search" clearable placeholder="房间号搜索"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabChange" :before-leave="beforeLeave">
      <el-tab-pane v-for="item in roomFloor" :key="item" :label="item+'楼'" :name="item">
        <h5 v-if="room==null || room.length<1">当前暂无数据</h5>
        <div v-for="(roomItem,index) in room" :key="index" style="display: block;width: 100%;text-align: center">
          <el-row v-if="index%4==0" style="display: block;width: 100%;padding-bottom: 10px;">
            <el-col :span="5" v-if="room[index]!=null" :class="[room[index].showCss]">{{room[index].roomNum}}</el-col>
            <el-col :span="1" v-if="room[index]!=null">-</el-col>
            <el-col :span="5" v-if="room[index+1]!=null">{{room[index+1].roomNum}}</el-col>
            <el-col :span="1" v-if="room[index+1]!=null">-</el-col>
            <el-col :span="5" v-if="room[index+2]!=null">{{room[index+2].roomNum}}</el-col>
            <el-col :span="1" v-if="room[index+2]!=null">-</el-col>
            <el-col :span="5" v-if="room[index+3]!=null">{{room[index+3].roomNum}}</el-col>
            <el-col :span="1" v-if="room[index+3]!=null">-</el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-divider></el-divider>
    <div style="font-size: 14px">
      <span style="margin-right: 8px;font-size: 16px;font-weight: 400;" v-for="(value,key) in roomStatusNum" :key="key">{{roomStatus[key]}}：{{value}}</span>
    </div>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "RoomStateMove",
    created:function() {
      /*Vue.http.interceptors.push(function(request, next) {
        // modify request
        request.method = 'POST';//在请求之前可以进行一些预处理和配置
        // continue to next interceptor
        next(function(response) {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
          let result = response.body;
          if(result.status === '2'){
            this.$confirm('登录超时，请重新登录?', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(function() {
              parent.window.location.href="/page/login";
            })
          }else{
            return response;
          }
        });
      });*/
      this.queryRoomFloor();
      this.queryRoomByFloor();
      this.queryRoomStatus();
      this.queryRoomStatusNum();
      this.queryRoomStyle();
      /*let isPush = getQueryValue('isPush');
      if(!this.isEmpty(isPush)) {
        this.roomStatusChange();
      }*/
    },
    data: function () {
      return {
        activeName: "1",
        roomFloor: [],
        room: [],
        roomStatusArr: [],
        searchParam:{},
        roomStatus: {'0': "总房数", '1': "空房", '2': "已出租", '3': "脏房", '4': '维修', '5': "员工房", '6': '已预定'},
        roomStyleArr:[],
        roomStatusNum:{},
        roomInfo:{},
        statusIndex:0
      }
    },
    methods: {
      queryRoomStyle:function() {
        this.$http.post(pixUrl + '/room/selectRoomStyle', {}).then(function (res) {
          let result = res.body;
          if(result.ok){
            this.roomStyleArr = result.result
          }
        }, function () {
          console.log('房间状态数量！');
        });
      },
      queryRoomStatusNum:function() {
        this.$http.post(pixUrl + '/room/selectRoomStatusNum', {}).then(function (res) {
          let result = res.body;
          if(result.ok){
            this.roomStatusNum = result.result
          }
        }, function () {
          console.log('房间状态数量！');
        });
      },
      queryRoomFloor:function() {
        this.$http.post(pixUrl + '/room/queryRoomFloor', {}).then(function (res) {
          let result = res.body;
          if(result.ok){
            this.roomFloor = result.result
          }
        }, function () {
          console.log('楼层请求失败！');
        });
      },
      queryRoomByFloor:function() {
        const loading = this.$loading({lock: true,text: 'Loading',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.7)'});
        this.$http.post(pixUrl + '/room/queryRoomByFloor', {'floor': this.activeName}).then(function (res) {
          let result = res.body;
          if(result.ok){
            this.room = result.result
            loading.close()
          }
        }, function () {
          console.log('楼层房间请求失败');
        });
      },
      queryRoomByStatus:function() {
        this.$http.post(pixUrl + '/room/queryRoomByStatus', this.searchParam).then(function (res) {
          let result = res.body;
          if (result.ok) {
            this.room = result.result
          }
        }, function () {
          console.log('By房间状态请求失败');
        });
      },
      queryRoomStatus:function() {
        this.$http.post(pixUrl + '/room/queryRoomStatus', {}).then(function (res) {
          let result = res.body;
          if(result.ok){
            this.roomStatusArr = result.result
          }
        }, function () {
          console.log('房间状态请求失败');
        });
      },
      toDetail:function(roomItem) {
        this.$http.post(pixUrl + '/room/selectRoomById', {'id': roomItem.id}).then(function (res) {
          if(res.body.ok){
            this.roomInfo = res.body.result
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      tabChange:function() {
        if (this.activeName === '整') {
          this.roomStatusChange();
          return;
        }
        this.searchParam.floor = this.activeName
        this.queryRoomByStatus();
      },
      beforeLeave:function(activeName, oldActiveName){
        console.log(oldActiveName)
        if(activeName==='roomStatusNum') return false
      },
      roomStatusChange:function() {
        this.tabChange();
      },
      selectRoomStatus(index){
        this.statusIndex = index;
        this.searchParam.status=index;
        if(index === 0){
          let def;
          this.searchParam.status=def;
        }
        this.roomStatusChange();
      },
      inputTimeOut:function(){
        if (this.timer) {
          clearTimeout(this.timer)
        }
        let thiz = this;
        this.timer = setTimeout(function() {
          thiz.roomStatusChange();
        }, 500)
      },
      isEmpty:function(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
        }
      },
      getNextMonth:function(date, addMonth) {
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
      numMul:function(x, y) {
        let multipleNum = 10000
        x = x * multipleNum
        y = y * multipleNum
        return x * y / multipleNum / multipleNum
      }
    }
  }
</script>

<style scoped>
tr td{
  padding: 10px;
  border-color: black;
  background-color: red;
  color: white;
  border-radius: 4px;
}
.el-col-5{
  padding: 10px;
  border-color: black;
  background-color: red;
  color: white;
  border-radius: 4px;
}
.empty{
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.success{
  background: #85ce61;
  border-color: #85ce61;
  color: #FFF;
}
.warning {
  color: #FFF;
  background-color: #E6A23C;
  border-color: #E6A23C;
}
.danger {
  color: #FFF;
  background-color: #F56C6C;
  border-color: #F56C6C;
}
.info {
  color: #FFF;
  background-color: #909399;
  border-color: #909399;
}
.primary {
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
}

</style>
