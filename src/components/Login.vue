<template>
  <div class="login_contanier">
    <div class="login_box">
        <h1>后台登录</h1>
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" label-width="0px" class="form_class">
          <!-- 登录 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <el-form-item  class="form_button">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username:'admin',
        password:'123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginRef.resetFields();
    },
    login() {
      this.$refs.loginRef.validate(async(valid) =>{
        if(!valid) return;
        const res =await this.$http.post('login',this.loginForm);
        if(res.data.meta.status !== 200) return this.$message.error('登录失败');
        // 另一种请求方法
        // const {data:res} =await this.$http.post('login',this.loginForm);
        // if(res.meta.status !== 200) return console.log("登录失败");
        this.$message.success({message:"登录成功", duration: 1000});
        // 存储token到sessionStorage
        window.sessionStorage.setItem('token',res.data.data.token);
        // 跳转到主页
        console.log(res.data.data.token);
        this.$router.push('/home')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_contanier {
  background-color: #fff;
  height: 100%;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    width: 450px;
    height: 300px;
    border-radius: 5px;
    background-color: bisque;
    h1 {
      padding: 10px 0 0 0;
      margin: 0;
      text-align: center;
    }
    
  }
}
.form_class{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
.form_button{
  display: flex;
  justify-content: flex-end;
}
</style>