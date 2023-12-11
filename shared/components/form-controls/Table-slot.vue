<script setup lang="ts">
defineOptions({ name: '' })
const TableSlot = {
  props: {
    slotFunction: {
      type: Function,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => ({})
    },
    column: {
      type: Object,
      default: () => ({})
    },
    selections: {
      type: Array,
      default: () => []
    },
    refresh: {
      type: Function,
      default: () => {}
    },
    confirm: {
      type: Function,
      default: () => {}
    },
    hasData: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  render() {
    return this.hasData
      ? Object.keys(this.row).length
        ? h(
            'div',
            {},
            this.slotFunction({
              row: this.row,
              selections: this.selections,
              refresh: this.refresh,
              confirm: this.confirm,
              list: this.list,
              index: this.index,
              column: this.column
            })
          )
        : null
      : h(
          'div',
          {},
          this.slotFunction({
            row: this.row,
            selections: this.selections,
            refresh: this.refresh,
            confirm: this.confirm,
            list: this.list,
            index: this.index,
            column: this.column
          })
        )
  }
}
</script>

<template><TableSlot /></template>
