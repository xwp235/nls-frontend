<template>
  <div class="login">
    <a-row>
      <a-col class="main" :span="6" :offset="9">
        <div class="title">
          甲蛙智能语音
        </div>
        <a-form
            :model="loginMember"
            name="basic"
            :wrapper-col="{ span: 24 }"
            @finish="login"
        >
          <a-form-item
              name="account" class="form-item"
              :rules="[{ required: true, message: '请输入手机号' }]"
          >
            <a-input v-model:value="loginMember.account" placeholder="手机号" size="large">
              <template #prefix>
                <MobileOutlined/>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
              name="password" class="form-item"
              :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password v-model:value="loginMember.password" placeholder="密码" size="large">
              <template #prefix>
                <LockOutlined/>
              </template>
            </a-input-password>
          </a-form-item>

<!--          <a-form-item name="imageCode" class="form-item"-->
<!--                       :rules="[{ required: true, message: '请输入图片验证码', trigger: 'blur' }]">-->
<!--            <a-input v-model:value="loginMember.imageCode" placeholder="图片验证码" size="large">-->
<!--              <template #prefix>-->
<!--                <SafetyOutlined/>-->
<!--              </template>-->
<!--              <template #suffix>-->
<!--                <img v-show="!!imageCodeSrc" :src="imageCodeSrc" alt="验证码" v-on:click="loadImageCode()"/>-->
<!--              </template>-->
<!--            </a-input>-->
<!--          </a-form-item>-->

          <a-form-item class="form-item">
            <a-button type="primary" block html-type="submit" class="login-btn" size="large">
              登&nbsp;录
            </a-button>
          </a-form-item>
        </a-form>
        <p class="footer">
          <router-link to="/register">我要注册</router-link>&nbsp;&nbsp;
          <router-link class="pull-right" to="/reset-password">忘记密码</router-link>
        </p>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
  import {useRouter} from 'vue-router'
  import { ref } from 'vue'
  import {MobileOutlined,SafetyOutlined,LockOutlined} from '@ant-design/icons-vue'
  import MemberApi from '@/api/MemberApi'
  import {message} from '@/utils/AntdGlobal'

  const router = useRouter()

  const loginMember = ref({
    account: '13000000000',
    password: 'a123456',
    // imageCode: ''
  })

  const login = async values => {
    console.log('开始登录:', values);
    await MemberApi.login({
      account: loginMember.value.account,
      // code: registerMember.value.code,
      password: hexMd5Key(loginMember.value.password),
    })
    message.success("登录成功！");
    //     store.commit("setMember", data.content);
    router.push('/home')
  }


  // ----------- 图形验证码 --------------------
  const imageCodeToken = ref()
  const imageCodeSrc = ref()
  /**
   * 加载图形验证码
   */
  // const loadImageCode = () => {
  //   loginMember.value.imageCode = "";
  //   imageCodeToken.value = Tool.uuid(8);
  //   imageCodeSrc.value = import.meta.env.VITE_SERVER + '/nls/web/kaptcha/image-code/' + imageCodeToken.value;
  // }
  //
  // loadImageCode()
</script>

<style scoped>
.login {
  padding-top: 8%;
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right: 0;
  background-color: #3B5998;
}

login .ant-form-item{
  margin-bottom: 5px!important;
}
.login .main {
  padding: 30px 20px;
  background-color: #F0F8FF;
  border-radius: 50px 0 ;
}
.login .title {
  vertical-align: middle;
  font-size: 1.8rem;
  /*color: transparent;*/
  /*-webkit-text-fill-color: #F0F8FF;*/
  font-weight: 600;
  /*-webkit-text-stroke: 2px #444;*/
  text-align: center;
}
.login .ant-input-affix-wrapper {
  padding-left: 10px;
  padding-right: 10px;
}

.login .ant-input-affix-wrapper > input.ant-input {
  padding: 4px 11px !important;
}
.login .form-item {
  margin-top: 15px;
}
.login .login-btn {
  margin-top: 8px;
  margin-bottom: 8px;
}
.login .footer {
  margin-top: 10px;
}
.login .footer a {
  color: #444;
}
</style>
