<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input
              v-model="queryInfor.query"
              placeholder="请输入内容"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" stripe border>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="email"></el-table-column>
        <el-table-column label="邮箱" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scops">
            <el-switch
              v-model="scops.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scops.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scops">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeDialogVisibleClick(scops.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scops.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfor.pagenum"
          :page-sizes="[1, 3, 5, 8]"
          :page-size="queryInfor.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addUserColse">
      <el-form ref="addUserFromRef" :model="addUserFrom" :rules="addUserFromRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserFrom.username" clearable ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserFrom.password" type="password" clearable ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFrom.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserFrom.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserFromClick"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <el-dialog title="修改用户信息" :visible.sync="changeDialogVisible" width="50%" @close="clearChangeDialogVisible">
      <el-form ref="changeUserFromRef" :model="changeUserFrom" :rules="addUserFromRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="changeUserFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="changeUserFrom.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="changeUserFrom.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUserFromClick"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "hellopage",
  data() {
    // 设置邮箱手机号校验规则
    var checkEmail = (rule,value,callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    var checkMobile = (rule,value,callback) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if(regMobile.test(value)){
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }

    return {
      queryInfor: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      changeDialogVisible: false,
      addUserFrom: {
        username: "admin123",
        password: "admin123",
        email: "admin123@123.com",
        mobile: "18756892356"
      },
      addUserFromRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator:checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator:checkMobile, trigger: 'blur' }
        ]
      },
      changeUserFrom: {}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfor,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 分页显示数据
    handleSizeChange(newSize) {
      this.queryInfor.pagesize = newSize;
      this.getUserList();
    },
    // 上下页
    handleCurrentChange(newPage) {
      this.queryInfor.pagenum = newPage;
      this.getUserList();
    },
    // 修改用户状态
    async changeState(newRow) {
      const { data: res } = await this.$http.put(
        `users/${newRow.id}/state/${newRow.mg_state}`
      );
      if (res.meta.status !== 200) {
        newRow.mg_state = !newRow.mg_state;
        return this.$message.error({ message: "修改失败", duration: 1000 });
      }
      this.$message.success({ message: "修改成功", duration: 1000 });
    },
    // 添加用户
    addUserColse() {
      this.$refs.addUserFromRef.resetFields()
    },
    addUserFromClick() {
      this.$refs.addUserFromRef.validate(async valid => {
        if(!valid) return
        const{data:res} = await this.$http.post('users',this.addUserFrom)
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('创建成功')
        this.dialogVisible = false
        this.getUserList();
      })
    },
    // 修改用户信息
    clearChangeDialogVisible() {
      this.$refs.changeUserFromRef.resetFields()
    },
    // 请求用户数据
    async changeDialogVisibleClick(id) {
      this.changeDialogVisible = true
      const{data:res} = await this.$http.get('users/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.changeUserFrom = res.data
      this.$message.success('已获取用户信息')
    },
    // 修改用户数据操作
    changeUserFromClick(){
      this.$refs.changeUserFromRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.put('users/' + this.changeUserFrom.id,{'email': this.changeUserFrom.email,'mobile':this.changeUserFrom.mobile})
        if(res.meta.status !== 200) return this.$message.error('更新失败')
        this.changeDialogVisible = false
        this.getUserList()
        this.$message.success('更新成功')
      })
    },
    // 删除用户操作
    async deleteUserById(id) {
      const confirmMessage = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmMessage !== 'confirm') {
          return this.$message.info('已取消操作')
        }
        const {data:res} = await this.$http.delete('users/' + id)
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('已删除')
        this.getUserList();

    } 
  },
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