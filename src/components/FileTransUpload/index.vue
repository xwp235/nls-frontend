<template>
  <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk" @close="handleClose">
     <p>
       <a-button type="primary" size="large" @click="selectFile2Upload">
         <span><UploadOutlined/>选择音频</span>
       </a-button>
       <input type="file" style="display:none;" ref="realFileComp"
              accept=".mp3,.wav,.m4a" @change="onUploadFileChange"/>
     </p>
      <p>
        已上传文件: {{uploadProgress.name}}<span v-show="uploadProgress.amount !== 0">，金额：<b style="color:red;font-size:18px;">{{uploadProgress.amount}} 元</b></span>
      </p>
      <p v-if="uploadProgress.percent">
        <a-progress :percent="Number(uploadProgress.percent.toFixed(1))"/>
      </p>
  </a-modal>
</template>

<script setup>
// 阿里云控制台地方 https://vod.console.aliyun.com/?spm=5176.8466032.top-nav.29.66721450j4qkih#/media/video/list
import {UploadOutlined} from '@ant-design/icons-vue'
import {nextTick, ref} from 'vue'
import {notification} from '@/utils/AntdGlobal'
import VodApi from '@/api/VodApi'

const open = ref(false)

const show = () => {
  open.value = true
  nextTick(() => {
    clearUploadProgress()
  })
}

const handleOk = () => {
  clearInputFileVal()
  open.value = false
}

const handleClose = () => {
  clearInputFileVal()
  open.value = false
}

// 使用defineExpose可以向方法外部暴露出指定数据和方法
defineExpose({
  show
})

// ------------- 选择文件 --------------
const realFileComp = ref()
const selectFile2Upload = () => {
  const inputFileRef = clearInputFileVal()
  inputFileRef.click()
}

// ------------- 上传文件 --------------
let uploadAuth
let uploadAddress
let videoId
const uploadProgress = ref({})

const onUploadFileChange = () => {
  const inputFileRef = realFileComp.value
  const selectedFile = inputFileRef.files[0]
  // 限制所选音频文件最大为500M
  const max = 500 * 1024 * 1024
  if (selectedFile.size > max) {
    notification.warn({
      message: '系统提示',
      description: '文件大小超过最大限制，最大为500M'
    })
    return
  }
  // 初始化上传进度信息
  // 初始化
  uploadProgress.value = {
    name: selectedFile.name,
    percent: 0,
    amount: 0,
    channel: "A"
  }

  // 调用后端接口获取上传凭证,获取成功后开始上传文件
  fetchUploadCredential(selectedFile).then(data => {
    // 后端与前端约定好用fileUrl做文件是否已经上传过的判断
    if (data.fileUrl) {
      console.log("文件已上传过，地址：", data.fileUrl)
      const uploadProgressVal = uploadProgress.value
      uploadProgressVal.percent = 100
      videoId = data.videoId
      uploadProgressVal.audio = data.fileUrl
    } else {
      console.log("获取上传凭证成功：", data)
      uploadAuth = data.uploadAuth
      uploadAddress = data.uploadAddress
      videoId = data.videoId
      // 正式开始上传文件
      aliyunUploader.addFile(selectedFile, null, null, null, null)
      aliyunUploader.startUpload()
    }
    calcAmount(videoId)
  })
}

const fetchUploadCredential = async (file) => {
  try {
    const key = b64_md5(`${file.name}${file.type}${file.size}${file.lastModified}`)
    return await VodApi.getUploadCredential({
      name: file.name,
      key
    })
  } catch (e) {
    console.log(e)
    notification.error({
      message: '系统提示',
      description: '上传文件失败'
    })
  }
}

const clearInputFileVal = () => {
  const inputFileRef = realFileComp.value
  // 为了让多次选择同一个文件时也能触发input组件的change事件，需要将value先清空再赋值
  if (inputFileRef) {
    inputFileRef.value = null
  }
  return inputFileRef
}

const clearUploadProgress = () => {
  uploadProgress.value = {
    name: '',
    percent: 0,
    amount: 0,
    lang: '',
    audio: '',
    fileSign: '',
    vod: '',
    channel: ''
  }
  clearInputFileVal()
}

const aliyunUploader = new AliyunUpload.Vod({
  //userID，必填，只需有值即可。
  userId:"122",
  //分片大小默认1 MB (1048576)，不能小于100 KB
  partSize: 104858,
  //并行上传分片个数，默认5
  parallel: 5,
  //网络原因失败时，重新上传次数，默认为3
  retryCount: 3,
  //网络原因失败时，重新上传间隔时间，默认为2秒
  retryDuration: 2,
  //是否上报上传日志到视频点播，默认为true
  enableUploadProgress: true,
  //开始上传
  'onUploadstarted': function (uploadInfo) {
    console.log("文件上传开始:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
    //从视频点播服务获取的uploadAuth、uploadAddress和videoId，设置到SDK里
    aliyunUploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
  },
  //文件上传成功
  'onUploadSucceed': function (uploadInfo) {
    console.log("文件上传成功: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
    let fileUrl = uploadInfo.endpoint.replace("https://", "https://" + uploadInfo.bucket + ".") + "/" + uploadInfo.object;
    console.log("文件地址: " + fileUrl)
    uploadProgress.value.audio = fileUrl
  },
  //文件上传失败
  'onUploadFailed': function (uploadInfo, code, message) {
    console.log("文件上传失败: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
  },
  //文件上传进度，单位：字节(上传过程中会不断调用此方法获取实时上传进度)
  'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
    console.log("文件上传中 :file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
    // 动态修改进度条上传百分比进度
    uploadProgress.value.percent = loadedPercent * 100;
  },
  //上传凭证超时
  'onUploadTokenExpired': function (uploadInfo) {
    console.log("onUploadTokenExpired")
    //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
    //从点播服务刷新的uploadAuth，设置到SDK里
    aliyunUploader.resumeUploadWithAuth(uploadAuth)
  },
  //全部文件上传结束
  'onUploadEnd':function(uploadInfo){
    console.log("文件上传结束");
    // 上传结束后，清空上传控件里的值，否则多次选择同一个文件会不触发change事件
    clearInputFileVal()
  }
})

// -------------- 计算收费金额 ---------------
const calcAmount = async () => {
  try {
    uploadProgress.value.amount = await VodApi.calcAmount(videoId)
  } catch (e) {
    console.log(e)
    notification.error({
      message: '系统提示',
      description: "计算收费金额异常"
    })
  }
}
</script>

<style scoped>

</style>
