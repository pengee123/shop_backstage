<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout() {
      this.$router.push('/login');
      window.sessionStorage.clear();
      this.$message.success('已退出')
    }
  },
}
</script>

<style lang="less" scoped>

</style>