<template>
  <a-button type="primary" @click="showUploadModal">开始上传音频</a-button>
  <file-trans-upload ref="fileTransUploadComp"/>
</template>

<script setup>
import {ref} from 'vue'
import FileTransUpload from '@/components/FileTransUpload/index.vue'

const fileTransUploadComp = ref()

const showUploadModal = () => fileTransUploadComp.value.show()


</script>

<style scoped>

</style>
