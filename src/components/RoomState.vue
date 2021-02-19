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
                <el-button v-for="roomItem in room" :key="roomItem.id" :type="roomItem.showCss"
                           :icon="roomItem.status == '6'?'el-icon-check':roomItem.status == '2'?'el-icon-circle-check':''"
                           @click="toDetail(roomItem)">{{roomItem.roomNum}}
                </el-button>
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

        <el-dialog title="空房" :visible.sync="showVacant" width="30%">
            <el-row>
                <el-col :span="4">
                    <el-button type="warning" @click="showReserve = true">预订</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="showCheckIn = true">入住</el-button>
                </el-col>
                <el-col :span="16">
                    <el-button type="info" @click="showStaff = true">员工入住</el-button>
                </el-col>
            </el-row>
            <!-- 新入住 -->
            <el-dialog :visible.sync="showCheckIn" :fullscreen="true" :show-close="false" append-to-body>
                <div slot="title">
                    <el-row type="flex" class="row-bg" justify="center" align="middle">
                        <el-col :span="12">
                            <h2>入住登记</h2>
                        </el-col>
                        <el-col :span="12" :offset="18">
                            <el-button @click="showCheckIn = false;showVacant=false">取 消</el-button>
                            <el-button type="primary" @click="saveCheckIn">保 存</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-form :model="roomForm" :rules="rules" ref="roomForm" label-position="right" label-width="110px">
                    <el-row>
                        <el-col :span="6">
                            <el-tabs value="first">
                                <el-tab-pane label="租房信息" name="first">
                                    <el-form-item label="房间号">
                                        {{roomForm.roomNum}}
                                    </el-form-item>
                                    <el-form-item label="合同期限">
                                        <el-input-number v-model="roomForm.contractMonthNum" :min="1"
                                                         :max="12"></el-input-number>
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
                                    <div v-for="item in roomForm.cohabitant" :key="item.id">
                                        <el-form-item label="同住人姓名">
                                            <el-input v-model="item.name" placeholder="同住人姓名"
                                                      style="width: 217px"></el-input>
                                            <el-button type="primary" icon="el-icon-delete" size="mini" circle
                                                       @click="deleteCohabitant(item)"
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
                                    <el-form-item label="费用合计">
                                        {{roomForm.totalFee}}
                                    </el-form-item>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                        <el-col :span="2"></el-col>
                    </el-row>
                </el-form>
            </el-dialog>

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
          <el-button @click="showStaff = false;showVacant=false">取 消</el-button>
          <el-button type="primary" @click="saveStaffCheckIn">确 定</el-button>
        </span>
            </el-dialog>

            <span slot="footer" class="dialog-footer">
        <el-button @click="showVacant = false;showVacant=false">取 消</el-button>
      </span>
        </el-dialog>

        <!-- 已入住 -->
        <el-dialog :visible.sync="showEnter" :show-close="false" width="80%" top="10px">
            <div slot="title">
                <el-row type="flex" class="row-bg" justify="center" align="middle">
                    <el-col :span="12">
                        <h2>已入住</h2>
                    </el-col>
                    <el-col :span="12" :offset="16">
                        <el-button type="danger" @click="checkOut(enterResult)">退 房</el-button>
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


        <!-- 退房 -->
        <el-dialog :visible.sync="showCheckOut" width="80%" :show-close="false" top="5px">
            <div slot="title">
                <el-row type="flex" class="row-bg" justify="center" align="middle">
                    <el-col :span="12">
                        <h2>退租</h2>
                    </el-col>
                    <el-col :span="12" :offset="18">
                        <el-button @click="refundForm=JSON.parse(JSON.stringify(refundFormBak));showCheckOut = false">取
                            消
                        </el-button>
                        <el-button type="primary" @click="saveCheckOut">保 存</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-form :model="refundForm" :rules="rules" ref="refundForm" label-position="right" label-width="110px">
                <el-row>
                    <el-col :span="6">
                        <el-tabs value="first">
                            <el-tab-pane label="合同信息" name="first">
                                <el-form-item label="房间号">
                                    {{refundForm.roomNum}}
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
      this.queryUserByStatus();
    },
    data: function () {
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
      return {
        activeName: "1",
        roomFloor: [],
        room: [],
        vacantRoom: [],
        roomStatusArr: [],
        searchParam: {},
        showVacant: false,
        showCheckIn: false,
        showReserve: false,
        showEnter: false,
        showStaff: false,
        showCheckOut: false,
        reserveMobile: '',
        totalFee: 0,
        saleUser: [],
        checkInStaff: [],
        reserve: {},
        collapseItem: ['1'],
        staffCheckIn: [],
        staffCheckInDate: [],
        enterResult: {'room': {}, 'contract': {}, 'customers': []},
        payTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {
          'key': 'POS机',
          'value': '3'
        }, {'key': '现金', 'value': '4'}],
        refendPayTypeMap: [{'key': '微信', 'value': '1'}, {'key': '支付宝', 'value': '2'}, {
          'key': '银行卡',
          'value': '3'
        }, {'key': '转房结转', 'value': '4'}],
        payTypeSelect: {'1': "微信", '2': "支付宝", '3': "POS机", '4': '现金'},
        rentStatusMap: {'0': '待交租', '1': '已交租', '2': '做废'},
        refendStatusMap: [{'key': '到期退租', 'value': '2'}, {'key': '违约退租', 'value': '3'}, {
          'key': '提前退租',
          'value': '4'
        }],
        roomForm: {'contractMonthNum': 1, cohabitant: [{'abc': 1}], 'totalFee': 0},
        refundForm: {
          'damageArr': [{'id': 0}],
          'otherCost': [{'id': 0}],
          'rentEnd': '',
          'rentRefundDate': new Date(),
          'refundDetail': [],
          'totalFee': 0,
          'waterNum': 0
        },
        refundFormBak: {
          'damageArr': [{'id': 0}],
          'otherCost': [{'id': 0}],
          'rentEnd': '',
          'rentRefundDate': new Date(),
          'refundDetail': [],
          'totalFee': 0,
          'waterNum': 0
        },
        reserveForm: {},
        pickerDisableOptions: {
          disabledDate(time) {
            const tomorrow = Date.now()
            return time.getTime() < tomorrow;
          },
        },
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
          ],

          reserveMobile: [{required: true, message: '请输入预订手机号', trigger: 'blur'},
            {pattern: '^1[0-9]{10}$', message: '手机号格式不正确', trigger: 'blur'}
          ],
          reservePrice: [
            {required: true, message: '请输入预订金额', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          effectiveTime: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
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
        }
      }
    },
    computed: {
      contractEnd: function () {
        const result = this.getNextMonth(this.roomForm.contractStart, this.roomForm.contractMonthNum)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.roomForm.contractEnd = new Date(result)
        return result;
      },
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
    },
    methods: {
      queryRoomFloor() {
        this.$http.post(pixUrl + '/room/queryRoomFloor', {}).then(function (res) {
          this.roomFloor = res.body
        }, function () {
          console.log('楼层请求失败！');
        });
      },
      queryRoomByFloor() {
        this.$http.post(pixUrl + '/room/queryRoomByFloor', {'floor': this.activeName}).then(function (res) {
          this.room = res.body
        }, function () {
          console.log('楼层房间请求失败');
        });
      },
      queryRoomStatus() {
        this.$http.post(pixUrl + '/room/queryRoomStatus', {}).then(function (res) {
          this.roomStatusArr = res.body
        }, function () {
          console.log('房间状态请求失败');
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
      queryUserByStatus() {
        this.$http.post(pixUrl + '/user/queryUserByStatus', {'status': '1'}).then(function (res) {
          const result = res.body;
          if (result.ok) {
            this.saleUser = res.body.result;
            this.staffCheckInDataMethod()
          }
        }, function () {
          console.log('by用户状态请求失败');
        });
      },
      queryReserve(roomId) {
        this.$http.post(pixUrl + '/reserve/queryReserveByMobile', {'roomId': roomId}).then(function (res) {
          this.reserve = res.body
          this.roomForm.reserveId = this.reserve.id
        }, function () {
          console.log('by手机号预定信息');
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
      queryStaffRoom(roomId, roomNum) {
        this.$http.post(pixUrl + '/integration/queryStaffRoom', {
          'roomId': roomId,
          'roomNum': roomNum
        }).then(function (res) {
          const result = res.body;
          if (result.ok) {
            const cohabitantIdArr = result.result.contract.cohabitantId.split(",");
            for (const item in cohabitantIdArr) {
              this.staffCheckIn.push(parseInt(cohabitantIdArr[item]));
            }
          }
        }, function () {
          console.log('by手机号预定信息');
        });
      },
      queryRentEndDate(contractId, status) {
        this.$http.post(pixUrl + '/rent/queryRentByStatus', {
          'contractId': contractId,
          'status': status
        }).then(function (res) {
          const result = res.body;
          if (result.ok) {
            const curRent = result.result[result.result.length - 1]
            this.refundForm.rentEnd = curRent.currentDate
            const overdueDay = parseInt((this.refundForm.rentRefundDate - this.refundForm.rentEnd) / 1000 / 60 / 60 / 24);
            this.refundForm.overdueDay = overdueDay < 0 ? 0 : overdueDay
            this.refundForm.noLiveDay = Math.abs(overdueDay)
            this.refundForm.dayPrice = curRent.dayPrice
          }
        }, function () {
          console.error("查询交租信息报错");
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
                    this.roomStatusChange();
                    this.roomForm = {};
                    this.showCheckIn = false;
                    this.showVacant = false;
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
      toDetail(roomItem) {
        this.reserve = {};
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
        } else if ("5" === roomItem.status) {
          this.showVacant = true;
          this.queryStaffRoom(roomItem.id, roomItem.roomNum);
          setTimeout(() => {
            this.roomForm.roomId = roomItem.id;
            this.roomForm.roomNum = roomItem.roomNum;
            this.showStaff = true;
          }, 10)
        } else if ("6" === roomItem.status) {
          this.showVacant = true;
          this.queryReserve(roomItem.id)
          setTimeout(() => {
            this.roomForm.roomId = roomItem.id;
            this.roomForm.roomNum = roomItem.roomNum;
            this.roomForm.originalPrice = roomItem.price;
            this.roomForm.waterNum = roomItem.waterNum;
            this.showCheckIn = true;
          }, 10)
        }
      },
      checkOut(enterResult) {
        this.refundForm.rentRefundDate = new Date().getTime()
        this.queryRentEndDate(enterResult.contract.id, '1');
        this.showEnter = false;
        this.refundForm.roomId = enterResult.room.id
        this.refundForm.roomNum = enterResult.room.roomNum
        this.refundForm.waterNum = enterResult.room.waterNum

        this.refundForm.customerId = enterResult.contract.customerId
        this.refundForm.customerName = enterResult.contract.customerName
        this.refundForm.contractStart = enterResult.contract.contractStart
        this.refundForm.contractEnd = enterResult.contract.contractEnd
        this.refundForm.contractId = enterResult.contract.id
        this.refundForm.contractNo = enterResult.contract.contractNo


        this.refundForm.rentStart = enterResult.contract.contractStart
        this.refundForm.customerMobile = enterResult.contract.customerMobile


        this.refundForm.deposit = enterResult.contract.deposit

        this.showCheckOut = true
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
      addCohabitant() {
        this.roomForm.cohabitant.push({'id': this.roomForm.cohabitant.length + 1});
      },
      deleteCohabitant(item) {
        if (this.roomForm.cohabitant.length == 1) return;
        let index = -1
        for (let i = 0; i < this.roomForm.cohabitant.length; i++) {
          index = i
          let value = this.roomForm.cohabitant[i]
          if (item.id === value.id) {
            break;
          }
        }
        this.roomForm.cohabitant.splice(index, 1);
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
      realPriceChange() {
        if (this.isEmpty(this.roomForm.realPrice)) return 0.00
        let totalFee = this.roomForm.realPrice * 2
        let reservePrice = this.isEmpty(this.reserve.reservePrice) ? 0 : this.reserve.reservePrice;
        //totalFee = totalFee - reservePrice
        this.roomForm.totalFee = totalFee - reservePrice
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
      sharingCardTypeChange(item) {
        if (item.cardType === '1') {
          this.rules.sharingCardNo.push({
            pattern: '^[1-9]\\d{5}(18|19|20|(3\\d))\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
            message: '身份证号格式不正确',
            trigger: 'blur',
            flag: 'cardNoValid'
          })
        } else {
          this.rules.sharingCardNo = [];
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
          let index = -1
          for (let i = 0; i < this.refundForm.refundDetail.length; i++) {
            let value = this.refundForm.refundDetail[i]
            if (value.subject === '换房费') {
              index = i
              break;
            }
          }
          if (index != -1) this.refundForm.refundDetail.splice(index, 1);
        }

        if (this.refundForm.refundPayType === '2') {
          this.refundForm.alipayNo = this.refundForm.customerMobile
        } else if (this.refundForm.refundPayType === '1') {
          this.refundForm.wechatNo = this.refundForm.customerMobile
        } else if (this.refundForm.refundPayType === '4') {
          this.searchParam.status = '1'
          this.searchParam.roomNum = ''
          this.queryVacantrRoom();
          this.refundForm.refundDetail.push({'subject': '换房费', 'price': -500})
        }
      },
      checkOutTypeChange() {
        //删除租房类型退款数据
        let index = -1
        for (let i = 0; i < this.refundForm.refundDetail.length; i++) {
          index = i
          let value = this.refundForm.refundDetail[i]
          if (value.flag) {
            index = 1
            break
          }
        }
        if (index == 1) this.refundForm.refundDetail.splice(0, 1);

        if (this.refundForm.checkOutType === '2') {
          this.refundForm.refundDetail.unshift({
            'flag': true,
            'subject': '押金',
            'price': this.refundForm.deposit
          })
        } else if (this.refundForm.checkOutType === '3') {
          this.refundForm.refundDetail.unshift({'flag': true, 'subject': '违约押金', 'price': 0})
        } else if (this.refundForm.checkOutType === '4') {
          const dayTotalFee = parseInt(this.refundForm.noLiveDay) * parseFloat(this.refundForm.dayPrice)
          this.refundForm.refundDetail.unshift({'flag': true, 'subject': '结余房租', 'price': dayTotalFee})
        }

      },

      electricNumBlur() {
        if (this.refundForm.refundDetail.length > 0) {
          let index = -1
          for (let i = 0; i < this.refundForm.refundDetail.length; i++) {
            let value = this.refundForm.refundDetail[i]
            if (value.subject === '结余电费') {
              index = i
              break;
            }
          }
          if (index != -1) this.refundForm.refundDetail.splice(index, 1);
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
          let index = -1
          for (let i = 0; i < this.refundForm.refundDetail.length; i++) {
            let value = this.refundForm.refundDetail[i]
            if (value.subject === '使用水费') {
              index = i
              break;
            }
          }
          if (index != -1) this.refundForm.refundDetail.splice(index, 1);
        }
        if (!this.isEmpty(this.refundForm.useWaterNum)) {
          this.refundForm.refundDetail.push({
            'flag': false,
            'subject': '使用水费',
            'price': this.numMul(this.refundForm.useWaterNum, -7)
          })
        }
      },
      costBlur(item, costType) {
        if (costType === 'damage') {
          const damageId = item.id
          const damageName = item.damageName;
          const damageMoney = item.damageMoney;
          if (!this.isEmpty(damageName) && !this.isEmpty(damageMoney)) {
            this.removeRefundDetailItem(costType, damageId)
            this.refundForm.refundDetail.push({
              'damageId': damageId,
              'subject': damageName,
              'price': -damageMoney
            })
          }
        } else if (costType === 'other') {
          const otherId = item.id
          const otherName = item.otherName;
          const otherMoney = item.otherMoney;
          if (!this.isEmpty(otherName) && !this.isEmpty(otherMoney)) {
            this.removeRefundDetailItem(costType, otherId)
            this.refundForm.refundDetail.push({
              'otherId': otherId,
              'subject': otherName,
              'price': otherMoney
            })
          }
        }
      },
      removeRefundDetailItem(costType, id) {
        let index = -1
        for (let i = 0; i < this.refundForm.refundDetail.length; i++) {
          let value = this.refundForm.refundDetail[i]
          if (costType === 'damage' && value.damageId === id) {
            index = i
            break
          } else if (costType === 'other' && value.otherId === id) {
            index = i
            break
          }
        }
        if (index != -1) this.refundForm.refundDetail.splice(index, 1);
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


