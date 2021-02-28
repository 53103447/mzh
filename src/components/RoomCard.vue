<template>
  <el-form ref="roomCardForm" :model="roomCardForm" :rules="rules" label-width="110px">
    <el-form-item label="缴费类型" prop="paymentType">
      <el-select v-model="roomCardForm.paymentType" clearable placeholder="请选择">
        <el-option v-for="item in paymentTypeArr" :key="item.value" :label="item.key" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="门卡数" v-if="roomCardForm.paymentType==='1'">
      <el-input-number v-model="roomCardForm.roomCardNum" :min="1"></el-input-number>张
    </el-form-item>
    <el-form-item label="金额" v-if="roomCardForm.paymentType==='1'">
      {{roomCardForm.roomCardNum * 50}}
    </el-form-item>
    <el-form-item label="水表吨数" prop="waterNum" v-if="roomCardForm.paymentType==='2'">
      <el-input v-model="roomCardForm.waterNum" placeholder="水表吨数"
                style="width: 212px"></el-input>
    </el-form-item>
    <el-form-item label="水费" prop="waterPrice" v-if="roomCardForm.paymentType==='2'">
      <el-input v-model="roomCardForm.waterPrice" placeholder="水费" style="width: 212px"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="savePayment">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "RentList",
    created() {
    },
    data() {
      return {
        roomCardForm:{'roomCardNum':1},
        rules:{
          paymentType: [
            {required: true, message: '请选择缴费类型', trigger: 'change'},
          ],
          waterNum: [
            {required: true, message: '请输入水表吨数', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ],
          waterPrice: [
            {required: true, message: '请输入水费', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur', transform: (value) => Number(value)},
          ]
        },
        paymentTypeArr:[{'key': '补门卡', 'value': '1'}, {'key': '水费', 'value': '2'}]
      }
    },
    methods:{
      savePayment(){
        // eslint-disable-next-line no-debugger
        this.$refs['roomCardForm'].validate((valid) => {
          if (valid) {
            this.$http.post(pixUrl + '/', this.roomForm).then(function (res) {
              const result = res.body;
              if (result.ok) {
                alert(1)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>