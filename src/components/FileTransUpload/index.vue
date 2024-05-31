<template>
  <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">

  </a-modal>
</template>

<script setup>
import {ref} from 'vue'

const open = ref(false)

const show = () => open.value = true

const handleOk = () => open.value = false

// 使用defineExpose可以向方法外部暴露出指定数据和方法
defineExpose({
  show
})
</script>

<style scoped>

</style>
