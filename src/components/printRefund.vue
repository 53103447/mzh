<template>
  <div>
    <table id="table" border="1" cellspacing="5" cellpadding="5" style="margin-top:-10px;margin: 0 auto;border-collapse: collapse;width: 50%">
      <caption align="top">
        <span style="font-size: 18px;">退租结算单</span>
        <div>
          <div style="font-size: 12px;float:left;" align="left"><span>new Date</span></div>
          <div style="font-size: 12px;float:right;" align="right">单据号：<span>0120200911D00370</span></div>
        </div>
      </caption>
      <tbody>
        <tr>
          <td colspan="4">受理时间</td>
        </tr>
        <tr>
          <td>项目</td>
          <td>租房名称</td>
          <td>房间号</td>
          <td>月租金</td>
        </tr>
        <tr>
          <td>川沙</td>
          <td>丁仁军</td>
          <td>8111</td>
          <td>1234</td>
        </tr>
        <tr>
          <td>合同租赁周期</td>
          <td colspan="3">2020年6月8日 至 2021年6月7日</td>
        </tr>
        <tr>
          <td>退租类型</td>
          <td colspan="3">违约退房</td>
        </tr>
        <tr>
          <td>费用结算日期</td>
          <td colspan="3">2020年6月8日 </td>
        </tr>
        <tr>
          <td>序号</td>
          <td colspan="2">结算项目</td>
          <td>金额</td>
        </tr>
        <tr>
          <td>1</td>
          <td colspan="2">押金</td>
          <td>1500</td>
        </tr>
        <tr>
          <td>2</td>
          <td colspan="2">押金</td>
          <td>1500</td>
        </tr>
        <tr>
          <td>合计</td>
          <td colspan="2"></td>
          <td>3000</td>
        </tr>
        <tr style="height: 100px;">
          <td style="width: 200px">退房验收情况</td>
          <td colspan="2" style="border-right: none"></td>
          <td  style="border-left: none;text-align:left;vertical-align: bottom;">验收人：</td>
        </tr>
        <tr>
          <td rowspan="4" style="width: 200px">承租方确认</td>
          <td rowspan="4" style="text-align: left;vertical-align: top">经办人（签字）：</td>
          <td rowspan="4" style="width: 120px">退还承租方名称及账号（需与租户名称一致，不一致的应具说明等）</td>
          <td style="width: 300px;text-align: left">持卡人名称：丁仁军</td>
        </tr>
        <tr>
          <td style="text-align: left">持卡人名称：丁仁军</td>
        </tr>
        <tr>
          <td style="text-align: left">持卡人名称：丁仁军</td>
        </tr>
        <tr>
          <td style="text-align: left">持卡人名称：丁仁军</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;border: 0px">1、本结算单一式贰份，租赁双方各持一份。</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;border: 0px">2、本结算单经承租方签字或盖章，并结清所有款项并交付相关票据后，对《租赁合同》履行事宜再无任何债权债务争议。</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;border: 0px">3、明确了签署结算单后，租户确认退款金额应按结算单履行完毕。双方对租赁合同应履行的事宜再无债权债务纠纷</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;border: 0px">4、租户签署结算单后确认在租赁期间未曾与我司有任何纠纷争议尚未解决</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  const pixUrl = "http://localhost:8096"
  export default {
    name: "printRefund",
    created() {
      this.$http.post(pixUrl + '/settlement/selectSettlementById', {'id':1}).then(function (res) {
        const result = res.body;
        if(result.ok){
          this.refundEntity = result.result
        }
      }, function () {
        console.log('查询缴费列表抵账！');
      });
    },
    data() {
      return {
        refundEntity:{}
      }
    }
  }
</script>

<style scoped>
  #table td /*设置表格文字左右和上下居中对齐*/
  {
    vertical-align: middle;
    text-align: center;
  }
</style>