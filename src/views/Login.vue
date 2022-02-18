<!--
 * @description  : 登录
 * @Author       : snoop-dog
 * @Date         : 2022-02-17 10:54:53
 * @LastEditors  : snoop-dog
 * @LastEditTime : 2022-02-17 14:02:36
 * @FilePath     : Login.vue
-->

<template>
  <el-container class="login-container">
    <el-main class="bg-left">
      <el-row class="del-dotted"></el-row>
    </el-main>
    <el-main class="bg-right"></el-main>
    <el-main class="login-form">
      <el-container class="form-container">
        <el-row class="form-text">登&nbsp;录</el-row>
        <el-main class="form-input">
          <el-row class="form-username">
            <el-input 
              v-model.trim="loginForm.username" 
              placeholder="用户名"
              @keyup.enter.native="loginSystem"
            >
            </el-input>
          </el-row>
          <el-row class="form-password">
            <el-input 
              v-model.trim="loginForm.password" 
              type="password" 
              placeholder="密码"
              @keyup.enter.native="loginSystem"
            >
            </el-input>
          </el-row>
        </el-main>
        <el-row class="form-btn">
          <el-button type="primary" @click.stop="loginSystem">
            登&nbsp;&nbsp;&nbsp;录
          </el-button>
        </el-row>
      </el-container>
    </el-main>
    <el-main class="form-bg"></el-main>
  </el-container>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { reactive, getCurrentInstance } from 'vue' 

  const { proxy } = getCurrentInstance()
  const router = useRouter()

  const loginForm = reactive({
    username: 'admin',
    password: '123456'
  })

  const loginSystem = () => {
    if (!loginForm.username) {
      return proxy.showMessageBox('请输入用户名！', 'warning')
    } else if (!loginForm.password) {
      return proxy.showMessageBox('请输入密码！', 'warning')
    }

    router.push('/layout')
    localStorage.setItem('username', loginForm.username)
  }
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  .bg-left {
    flex: 2.5;
    position: relative;
    background: url('@/assets/images/login_bg_left.png') 0 0 no-repeat;
    background-size: 100% 100%;
    .login-text {
      height: 160px;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 37%;
      left: 17%;
      p {
        flex: 1;
        line-height: 80px;
        font-size: 50px;
        color: #333;
        letter-spacing: 2px;
        margin: 0;
        font-weight: 600;
      }
    }
    .del-dotted {
      width: calc(28.6% + 210px);
      height: 15%;
      background: #F6F8FB;
      position: absolute;
      top: calc(28% + 440px);
      left: calc(71.4% - 210px);
    }
  }
  .bg-right {
    flex: 1;
    background-image: linear-gradient(180deg, #394261 0%, #1D2041 100%);
  }
  .login-form {
    width: 420px;
    height: 440px;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    left: calc(71.4% - 210px);
    top: 28%;
    z-index: 2;
    box-shadow: 0 1px 10px 0 rgba(0,0,0,0.13);
    .form-container {
      width: 100%;
      height: 100%;
      background: url('@/assets/images/login_bg_form.png') 0 0 no-repeat;
      background-size: contain;
      padding: 100px 80px 50px 80px;
      flex-direction: column;
      .form-text {
        flex: 0 0 33px;
        text-align: center;
        font-size: 24px;
        color: #4a4a4a;
        line-height: 33px;
        display: block;
      }
      .form-input {
        flex: 1;
        .el-row {
          margin: 30px 0;
          :deep(.el-input__inner) {
            // &__inner {
            //   height: 30px;
            //   line-height: 30px;
            //   border: none;
            //   padding: 0;
            //   border-radius: 0;
            //   border-bottom: 2px solid #ddd;
            //   &:focus {
            //     box-shadow: unset;
            //     border-color: rgba(36, 105, 243, .6);
            //   }
            // }
            height: 30px;
            line-height: 30px;
            border: none;
            padding: 0;
            border-radius: 0;
            border-bottom: 2px solid #ddd;
            &:focus {
              box-shadow: unset;
              border-color: rgba(36, 105, 243, .6);
            }
          }
        }
      }
      .form-btn {
        flex: 0 0 46px;
        .el-button {
          width: 100%;
          height: 100%;
          border-radius: 23px;
          background: #2469F3;
          box-shadow: 0 3px 12px 0 rgba(13,66,221,0.38);
          font-size: 16px;
          color: #fff;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .form-bg {
    width: 420px;
    height: 80px;
    position: absolute;
    z-index: 1;
    left: calc(71.4% - 170px);
    top: calc(28% + 380px);
    background: url('@/assets/images/login_bg_right.png') 60px 0 no-repeat;
  }
}
</style>