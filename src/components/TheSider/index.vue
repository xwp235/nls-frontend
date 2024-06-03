<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
    >
      <a-menu-item key="/home/welcome">
        <router-link to="/home/welcome">
          <CoffeeOutlined/>
          <span>欢迎使用</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="/home/file-trans">
        <router-link to="/home/file-trans">
          <VideoCameraOutlined/>
          <span>语音识别</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="/home/help">
        <router-link to="/home/help">
          <QuestionCircleOutlined/>
          <span>帮助文档</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import {CoffeeOutlined, QuestionCircleOutlined, VideoCameraOutlined} from '@ant-design/icons-vue'
  import {ref, watch} from "vue";
  import {useRouter} from 'vue-router'

  const selectedKeys = ref(['/home/welcome'])

  const router = useRouter()

  watch(() => router.currentRoute.value.path, newPath => {
    selectedKeys.value = [newPath]
  }, {
    immediate: true
  })
</script>
