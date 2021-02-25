<template>
  <div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="1">
        房间号
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.roomNum" placeholder="请输入房间号" clearable size="small" @input="queryRenewalInfo"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        客户姓名
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchParam.customerName" placeholder="请输入客户姓名" clearable size="small" @input="queryRenewalInfo"></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        退租类型
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.checkOutType" clearable placeholder="请选择" @change="queryRenewalInfo">
          <el-option v-for="item in checkOutTypeArr" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="1" style="margin-right: 8px">
        退款状态
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchParam.status" clearable placeholder="请选择" @change="queryRenewalInfo">
          <el-option v-for="item in refundStatusArr" :key="item.value" :label="item.key" :value="item.value">
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
      <el-table-column prop="mobilePhone" label="租户电话"></el-table-column>
      <el-table-column label="退租类型">
        <template slot-scope="scope">
          {{checkOutType[scope.row.checkOutType]}}
        </template>
      </el-table-column>
      <el-table-column label="退款类型">
        <template slot-scope="scope">
          {{refundPayType[scope.row.refundPayType]}}
        </template>
      </el-table-column>
      <el-table-column label="受理日期">
        <template slot-scope="scope">
          {{scope.row.created | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="totalFee" label="退款金额"></el-table-column>
      <el-table-column label="退款状态">
        <template slot-scope="scope">
          {{refundStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toRefundDetail(scope.row.id)">查看详情</el-button>
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
    <el-dialog :visible.sync="showDialog" :show-close="false" width="80%" top="10px">
      <div slot="title">
        <el-row type="flex" class="row-bg" justify="center" align="middle">
          <el-col :span="14">
            <h2>退款单详情</h2>
          </el-col>
          <el-col :span="10" :offset="20">
            <el-button type="primary" @click="showDialog = false">关 闭</el-button>
          </el-col>
        </el-row>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>合同信息</span>
        </div>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="2">
            房间号：
          </el-col>
          <el-col :span="6">
            {{refundEntity.roomNum}}
          </el-col>
          <el-col :span="2">
            合同号：
          </el-col>
          <el-col :span="6">
            {{refundEntity.contractNo}}
          </el-col>
          <el-col :span="2">
            合同周期：
          </el-col>
          <el-col :span="6">
            {{refundEntity.contractDateRange}}
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="2">
            签约人：
          </el-col>
          <el-col :span="6">
            {{refundEntity.customerName}}
          </el-col>
          <el-col :span="2">
            联系方式：
          </el-col>
          <el-col :span="6">
            {{refundEntity.mobilePhone}}
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-card>
      <br/>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>退款路径</span>
        </div>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="2">
            收款人：
          </el-col>
          <el-col :span="6">
            {{refundEntity.customerName}}
          </el-col>
          <el-col :span="2">
            退款方式：
          </el-col>
          <el-col :span="6">
            {{refundPayType[refundEntity.refundPayType]}}
          </el-col>
          <el-col :span="2">
            退款账号：
          </el-col>
          <el-col :span="6">
            <span v-if="refundEntity.refundPayType==='1'">{{refundEntity.wechatNo}}</span>
            <span v-if="refundEntity.refundPayType==='2'">{{refundEntity.alipayNo}}</span>
            <span v-if="refundEntity.refundPayType==='3'">{{refundEntity.bank+'—'+refundEntity.bankAddress+'—'+refundEntity.bankNo}}</span>
            <span v-if="refundEntity.refundPayType==='4'">{{'结转房间'+refundEntity.carryRoomNum}}</span>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>退款信息</span>
        </div>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="2">
            受理日期：
          </el-col>
          <el-col :span="4">
            {{refundEntity.created | formatDate }}
          </el-col>
          <el-col :span="2">
            退租类型：
          </el-col>
          <el-col :span="4">
            {{checkOutType[refundEntity.checkOutType]}}
          </el-col>
          <el-col :span="2">
            退款金额：
          </el-col>
          <el-col :span="4">
            {{refundEntity.totalFee}}
          </el-col>
          <el-col :span="2">
            状态：
          </el-col>
          <el-col :span="4">
            {{refundStatus[refundEntity.status]}}
          </el-col>
        </el-row>
      </el-card>

    </el-dialog>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "refundList",
    created() {
      this.queryRenewalInfo()
    },
    data() {
      return {
        tableData:[],
        searchParam:{'pageNo':1,'pageSize':10},
        tableTotalRecord:0,
        checkOutType: {'2': "到期退房", '3': "违约退房", '4': "提前退房"},
        checkOutTypeArr: [{'key': '到期退房', 'value': '2'},{'key': '违约退房', 'value': '3'},{'key': '提前退房', 'value': '4'}],
        refundPayType: {'1': "微信", '2': "支付宝", '3': "银行卡", '4': "换房结转"},
        refundStatus: {'0': "待退款", '1': "已退款"},
        refundStatusArr: [{'key': '待退款', 'value': '0'},{'key': '已退款', 'value': '1'}],
        showDialog:false,
        refundEntity:{},
      }
    },
    methods:{
      queryRenewalInfo(){
        this.$http.post(pixUrl + '/settlement/selectAllByPage', this.searchParam).then(function (res) {
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
        this.queryRenewalInfo()
      },
      pageNoChange(val){
        this.searchParam.pageNo = val
        this.queryRenewalInfo()
      },
      toRefundDetail(refundId){
        this.$http.post(pixUrl + '/settlement/selectSettlementById', {'id':refundId}).then(function (res) {
          const result = res.body;
          if(result.ok){
            this.refundEntity = result.result
            this.showDialog = true;
          }
        }, function () {
          console.log('查询缴费列表抵账！');
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
