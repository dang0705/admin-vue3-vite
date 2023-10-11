<template>
	<NewTable :columns="columns" :condition-formn="conditionForms"></NewTable>
</template>

<script setup lang="ts" name="system${ClassName}">
// import {  delObjs,getObj,addObj } from "/@/api/${moduleName}/${functionName}";

// 表格数据
// const columns = [
//   #foreach($field in $gridList)
//   {
//     prop: '${field.attrName}',
//     label: '${field.fieldComment}',
//     width: ${field.width || 200},
//     #if($field.slot)
//     slot: true,
//     #end
//   },
//  #end
//  {
//   label: '操作',
//    prop: 'actions',
//    fixed: 'right',
//    slot: true,
//   },
// ];
const columns = [];
const conditionForms = [];
</script>
