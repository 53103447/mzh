<template>
  <div>
    <div style="display: block;height: 80px;">
    </div>
    <table id="table" border="1" cellspacing="5" cellpadding="5" style="margin: auto auto;border-collapse: collapse;width: 80%">
      <caption align="top" style="padding: 10px;">
        <div>
          <div style="font-size: 16px;float:left;" align="left"><span>日期：2021-02-28</span><span style="margin-left: 20px">房间号：8112</span></div>
          <div style="font-size: 16px;float:right;" align="right"><span>姓名：汤游</span></div>
        </div>
      </caption>
      <tbody>
        <tr>
          <th>收款事由</th>
          <th>收款方式</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
        <tr>
          <td>新签入住</td>
          <td>微信</td>
          <td>1800</td>
          <td>花木成畦手自栽</td>
        </tr>
        <tr>
          <td colspan="4" style="border: none">
            <div style="font-size: 16px;float:left;padding:10px" align="left">
              <div style="padding-top:100px">店名：8+1青年社区</div>
              <div style="padding-top:50px;padding-bottom: 50px;">单位印章：</div>
            </div>
            <div style="font-size: 16px;float:right;padding:10px" align="right">
              <div style="padding-top:100px">合计：1800</div>
              <div style="padding-top:50px;padding-bottom: 50px;"><span style="padding-right: 180px;">经办人：徐亚婷</span><span>打印日期：2020-11-11</span></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "printRefund"
  }
</script>

<style scoped>
  table{
    border-collapse: collapse;
    width: 100%;
    font-size: 22px;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  table td {
    padding: 2px;
    border: 1px solid #000000;
  }
</style>