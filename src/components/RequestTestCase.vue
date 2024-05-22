<template>
  <a-layout>
    <the-header/>
    <a-layout>
      <the-sider/>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <button @click="showMessage">显示消息</button>
          <a-button @click="sendGet">发送GET请求</a-button>
          <a-button @click="sendPost">发送POST请求</a-button>
          <a-button @click="sendPostForm">发送POST FORM请求(后端用@RequestParam Map String,Object params 接收)</a-button>
          <a-button @click="sendPostForm2">发送POST FORM 2请求(后端用对象且不在变量前加注解接收)</a-button>
          <a-button @click="downloadFile">下载文件</a-button>
          <a-button @click="showLoading">显示loading</a-button>
          <a-button @click="hideLoading">关闭loading</a-button>

          <a-upload
              v-model:file-list="fileList"
              name="files"
              action="/api/upload/1"
              @change="handleChange"
              multiple
          >
            <a-button>
              <upload-outlined></upload-outlined>
              Click to Upload
            </a-button>
          </a-upload>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import TheHeader from '@/components/TheHeader/index.vue'
import TheSider from '@/components/TheSider/index.vue'
import http from '@/utils/httpRequest'
import {message} from '@/utils/AntdGlobal'
import {ref} from 'vue'
import {UploadOutlined} from '@ant-design/icons-vue'
import {showLoading, hideLoading} from '@/utils/loading'

const showMessage = () => {
  // 使用$message来调用Message组件的方法
  message.success('这是一个成功消息')
  message.error('这是一个错误消息')
}

const sendGet = () => {
  http.get('/get/1', {
    name: 'Jack',
    age: 21
  }, {
    showLoading: true,
    showError: true
  }).then(rs => {
    console.log(rs)
  })
}

const sendPost = () => {
  http.post('/get/2', {
    name: 'Jack',
    age: 22
  }, {
    showLoading: true,
    showError: true
  }).then(rs => {
    console.log(rs)
  })
}

const sendPostForm = () => {
  http.postForm('/get/3', {
    name: 'Jack',
    age: 23
  }, {
    showLoading: true,
    showError: true
  }).then(rs => {
    console.log(rs)
  })
}

const sendPostForm2 = () => {
  http.postForm('/get/4', {
    name: 'Jack',
    age: 23
  }, {
    showLoading: true,
    showError: true
  }).then(rs => {
    console.log(rs)
  })
}

const fileList = ref([])
const handleChange = (info) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}

const downloadFile = () => {
  http.downloadFile('/download', {
    name: 'Jack',
    age: 23
  }, {
    showLoading: true,
    showError: true
  })
}
</script>

<style scoped>
.site-layout-background {
  background: #fff;
}
</style>
