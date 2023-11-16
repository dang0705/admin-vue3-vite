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
    }
  },
  render() {
    return h(
      'div',
      {},
      this.slotFunction({
        row: this.row,
        selections: this.selections,
        refresh: this.refresh,
        confirm: this.confirm
      })
    )
  }
}
</script>

<template><TableSlot /></template>
