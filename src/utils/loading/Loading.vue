<template>
  <Spin tip="加载中" size="large">
    <div class="app-loading-content"/>
  </Spin>
</template>

<script setup>
  import {Spin} from 'ant-design-vue'
</script>

<style>
    .app-loading {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 20px;
    }

    .app-loading .ant-spin-text {
      color: #000;
    }

    .app-loading .ant-spin-dot-item {
      background-color: #000;
    }
</style>
