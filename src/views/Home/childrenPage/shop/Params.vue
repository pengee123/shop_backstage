<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <span>分类参数</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "params",
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