<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <span>数据报表</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "categories",
};
</script>

<style lang="less">
.nav {
  margin-bottom: 30px;
}
.el-table {
  margin-top: 30px;
}
.el-pagination {
  margin-top: 30px;
}
</style>