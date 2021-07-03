<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <div class="addgoods">
        <el-button type="primary" @click="openNewDoodsDialogVisible"
          >添加商品</el-button
        >
      </div>

      <!-- 表格 -->
      <tree-table
        :data="goodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
      >
        <!-- 是否有效 -->
        <template slot="isright" slot-scope="scops">
          <i
            v-if="scops.row.cat_deleted === false"
            class="el-icon-success green"
          ></i>
          <i v-else class="el-icon-error red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scops">
          <el-tag v-if="scops.row.cat_level === 0" type="success">一级</el-tag>
          <el-tag v-else-if="scops.row.cat_level === 1" type="warning"
            >二级</el-tag
          >
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="setting" slot-scope="scops" width="200px">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-setting"
            @click="openChangeDialogVisible(scops.row.cat_id)"
            >编辑</el-button
          >
          <el-button size="mini" type="warning" icon="el-icon-delete" @click="deleteGoodsById(scops.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加商品弹框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="newDoodsDialogVisible"
      width="50%"
    >
      <el-form
        ref="addGoodsFormRef"
        :model="addGoodsForm"
        label-width="100px"
        :rules="addGoodsFormRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addGoodsForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称：">
          <el-cascader
            v-model="ParentsValue"
            :options="ParentsOptions"
            :props="ParentsProps"
            clearable
            @change="ParentsChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newDoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="PutChangeDialogVisible()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="changeDialogVisible" width="50%">
      <el-form
        ref="ChangeGoodsFormRef"
        :model="ChangeGoodsForm"
        label-width="100px"
        :rules="addGoodsFormRules"
      >
      <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="ChangeGoodsForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeDialogVisibleClick()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "goods",
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      newDoodsDialogVisible: false,
      changeDialogVisible: false,
      goodsList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isright",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "setting",
        },
      ],
      addGoodsFormRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1到 5 个字符", trigger: "blur" },
        ],
      },
      addGoodsForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      ChangeGoodsForm: {
        cat_name: "",
      },
      changeId: 0,
      ParentsOptions: [],
      ParentsValue: [],
      ParentsProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品信息
    async getGoodsList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodsList = res.data.result;
      this.total = res.data.total;
    },
    // 分页数据操作
    handleSizeChange(newsizes) {
      this.querInfo.pagesize = newsizes;
      this.getGoodsList();
    },
    handleCurrentChange(newpages) {
      this.querInfo.pagenum = newpages;
      this.getGoodsList();
    },
    // 添加商品操作
    // 打开弹框
    openNewDoodsDialogVisible() {
      this.getParentsOptions()
      this.newDoodsDialogVisible = true;
    },
    // 获取父级数据
    async getParentsOptions() {
      const {data:res} = await this.$http.get('categories',{params: {type:2}})
      if(res.meta.status !== 200) return this.$message.error('error')
      this.ParentsOptions = res.data
      },
      // 存储数据
    ParentsChange() {
      if(this.ParentsValue.length > 0) {
        this.addGoodsForm.cat_pid = this.ParentsValue[this.ParentsValue.length - 1]
        this.addGoodsForm.cat_level = this.ParentsValue.length
      } else{
        this.addGoodsForm.cat_pid = 0
        this.addGoodsForm.cat_level = 0
      }
    },
    // 点击提交
    PutChangeDialogVisible() {
      this.$refs.addGoodsFormRef.validate(async valid =>{
        if(!valid) return
        const {data:res} = await this.$http.post('categories', this.addGoodsForm)
        if(res.meta.status !== 201) return this.$message.error('error')
        this.$message.success('success')
        this.newDoodsDialogVisible = false
        this.getGoodsList()
      })
    },

    //修改商品操作
    // 打开弹框
    openChangeDialogVisible(id) {
      this.changeDialogVisible = true;
      this.changeId = id
    },
    changeDialogVisibleClick() {
      this.$refs.ChangeGoodsFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.put('categories/' + this.changeId,this.ChangeGoodsForm)
        if(res.meta.status !== 200) return this.$message.error('error')
        this.getGoodsList()
        this.$message.success('success')
        this.changeDialogVisible = false
      })
    },
    // 删除分类名
    async deleteGoodsById(id) {
      const confirmMessage = await this.$confirm(
        "此操作将永久删除该分类名称, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmMessage !== "confirm") {
        return this.$message.info("已取消操作");
      }
      const {data:res} = await this.$http.delete('categories/' + id)
      if(res.meta.status !== 200) return this.$message.error('error')
      this.getGoodsList()
      this.$message.success('success')
    }
  },
};
</script>

<style lang="less">
.addgoods {
  margin-bottom: 15px;
}
.nav {
  margin-bottom: 30px;
}
.el-table {
  margin-top: 30px;
}
.el-pagination {
  margin-top: 30px;
}
.green {
  color: lightgreen;
}
.red {
  color: red;
}
</style>