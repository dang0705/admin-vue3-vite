<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/merchantAccountCapital.ts">
              <template #actions="{ row: {  } }">
		
	      </template>
        </Table-view>
</template>

<script setup lang="ts" name="systemMerchantAccountCapital">
import {  delObjs,getObj,addObj } from "/@/api/finance/merchantAccountCapital";

const columns = [
  {
    prop: 'merchantId',
    label: '商户id',
    'min-width':150
  },
  {
    prop: 'subAccountNum',
    label: '子账号',
    'min-width':150
  },
  {
    prop: 'paymentBankId',
    label: '支付通道id',
    'min-width':150
  },
  {
    prop: 'spId',
    label: '服务商id',
    'min-width':150
  },
  {
    prop: 'balance',
    label: '可用余额',
    'min-width':150
  },
  {
    prop: 'freeze',
    label: '冻结金额',
    'min-width':150
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
  },
];

const conditionForms = [];
</script>
