<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="loginForm" :rules="fieldRules" ref="fieldRules" label-width="0px" class="ms-content">
        <h2 class="title" style="padding-left:22px;" >系统登录</h2>
        <el-form-item prop="account">
          <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item >
          <el-col :span="12">
            <el-form-item prop="captcha">
              <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码, 单击图片刷新"
                style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item>
                <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha">
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:48%;float: left;" @click.native.prevent="reset">重 置</el-button>
          <el-button type="primary" style="width:48%;float: left;" @click.native.prevent="login('fieldRules')" :loading="loading">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from "js-cookie"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"

export default {
  name: 'Login',
  components:{
    ThemePicker,
    LangSelector
  },
  data: function(){
    return {
      loading: false,
      checked: true,
      loginForm: {
        account: 'admin',
        password: '123456',
        captcha:'',
        src: ''
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {    
    login(fieldRules) {
      // this.loading = true
      let userInfo = {loginName:this.loginForm.account, password:this.loginForm.password, captcha:this.loginForm.captcha}
      let userRequest = {'userRequest' : userInfo}
      this.$refs[fieldRules].validate((valid) => {
        if (valid) {
          this.$api.login.login(userInfo).then((res) => {
            if(res.code != '0') {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            } else {
              Cookies.set('token', res.data.token) // 放置token到Cookie
              sessionStorage.setItem('user', userInfo.loginName) // 保存用户到本地会话
              this.global.loginName = userInfo.loginName // 将用户名保存全局变量
              sessionStorage.setItem('roleId', res.data.role_id) // 保存用户到本地会话
              this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
              this.$router.push('/')  // 登录成功，跳转到主页
            }
            this.loading = false
          }).catch((res) => {
            this.$message({
              message: res.message,
              type: 'error'
            })
          });
        } else {
          console.log('error submit!!');
          this.loading = false;
          return false;
        }
      });
    },
    refreshCaptcha: function(){
      this.loginForm.src = this.global.baseUrl + "/getCode?t=" + new Date().getTime();
    },
    reset() {
      this.$refs.fieldRules.resetFields()
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
  },
  mounted() {
    this.refreshCaptcha();
    let _this = this;
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            _this.login('fieldRules');
        }
    }
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor
    })
  }
}
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 30px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>