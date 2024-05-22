<template>
  <config-provider>
    <antd-app>
      <antd-global/>
      <router-view/>
    </antd-app>
  </config-provider>
</template>

<script setup>
  import AntdGlobal from '@/utils/AntdGlobal'
  import {App as AntdApp, ConfigProvider} from 'ant-design-vue'
</script>
