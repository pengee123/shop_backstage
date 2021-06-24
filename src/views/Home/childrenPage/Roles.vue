<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button type="success" @click="addRolesDialogVisible = true"
        >添加用户</el-button
      >
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scops">
            <el-row
              class="useflex"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '']"
              v-for="(item1, index1) in scops.row.children"
              :key="item1.id"
            >
              <!-- 一级菜单 -->
              <el-col :span="5" class="center">
                <el-tag
                  size="medium"
                  closable
                  @close="deleteRightById(scops.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  class="useflex"
                  :class="[index2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(scops.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      class="margingleft"
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      type="warning"
                      closable
                      @close="deleteRightById(scops.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scopes">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="setRoles(scopes.row.id)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRolesById(scopes.row.id)"
              >删除</el-button
            >
            <el-button type="danger" icon="el-icon-setting" size="mini" @click="openGiveRoles(scopes.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="40%"
      @close="demoxx"
    >
      <el-form ref="addUsersFromRef" :model="addUsersFroms" label-width="90px">
        <el-form-item label="角色名称:">
          <el-input v-model="addUsersFroms.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:">
          <el-input v-model="addUsersFroms.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取消</el-button>
        <el-button @click="addRolesDialogVisibleClick">确认</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息弹出框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="setRolesDialogVisible"
      width="50%"
    >
      <el-form ref="setRolesFormRef" :model="setRolesForm" label-width="90px">
        <el-form-item label="角色名称:">
          <el-input v-model="setRolesForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述:">
          <el-input v-model="setRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取消</el-button>
        <el-button @click="setRolesClick">确认</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="giveRolesDialogVisible"
      width="50%"
      @close="clearDefaultrolesTreeData"
    >
      <el-tree :data="rolesTreeData"
       :props="rolesProps"
       show-checkbox
       default-expand-all
       node-key="id"
       :default-checked-keys="defaultrolesTreeData"
       ref="treeRef"
       ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="giveRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="giveRolesClick" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      setRolesForm: {},
      addRolesDialogVisible: false,
      setRolesDialogVisible: false,
      giveRolesDialogVisible: false,
      addUsersFroms: {
        roleName: "经理",
        roleDesc: "代理经理",
      },
      rolesTreeData: [],
      rolesProps: {
        children: 'children',
          label: 'authName'
      },
      defaultrolesTreeData: [],
      nowid: ''
    };
  },
  created() {
    this.getrolesList();
  },
  methods: {
    // 获取数据
    async getrolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.rolesList = res.data;
    },
    // 删除用户权限
    async deleteRightById(row, id) {
      const rightMessage = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (rightMessage !== "confirm") {
        return this.$message.info("已取消操作");
      }
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      row.children = res.data;
    },
    // 关闭窗口清空表单
    demoxx() {
      this.$refs.addUsersFromRef.resetFields();
    },
    async addRolesDialogVisibleClick() {
      const { data: res } = await this.$http.post("roles", this.addUsersFroms);
      if (res.meta.status !== 201) {
        return this.$message.error("创建失败");
      }
      this.$message.success("创建成功");
      this.getrolesList();
      this.addRolesDialogVisible = false;
    },
    // 修改角色信息
    async setRoles(id) {
      this.setRolesDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$$message.error("error");
      }
      this.setRolesForm = res.data;
    },
    async setRolesClick() {
      const { data: res } = await this.$http.put(
        "roles/" + this.setRolesForm.roleId,
        {
          roleName: this.setRolesForm.roleName,
          roleDesc: this.setRolesForm.roleDesc,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改失败");
      }
      this.$message.success("修改成功");
      this.setRolesDialogVisible = false;
      this.getrolesList();
    },
    // 删除角色信息
    async deleteRolesById(id) {
      const confirmMessage = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("已删除");
      this.getrolesList();
    },
    // 分配权限
    // 打开弹窗按钮
    async openGiveRoles(row) {
      this.nowid = row.id
      this.giveRolesDialogVisible = true
      const {data:res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
       this.rolesTreeData = res.data
       this.getLeafKeys(row,this.defaultrolesTreeData)
    },
    // 递归函数获取所有的三级节点的id
    getLeafKeys(node,arr) {
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => 
      this.getLeafKeys(item,arr))
    },
    clearDefaultrolesTreeData() {
      this.defaultrolesTreeData = []
    },
    // 提交按钮
    async giveRolesClick() {
      const idArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = idArr.join(',')
      const {data:res} = await this.$http.post(`roles/${this.nowid}/rights`,{rids:idStr})
       if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status);
      }
      this.$message.success(res.meta.msg);
      this.giveRolesDialogVisible = false 
      this.getrolesList()
    }
  },
};
</script>

<style lang="less">
.el-tag {
  margin: 10px 0 10px 0;
}
.bdtop {
  border-top: 1px solid #999;
}
.bdbottom {
  border-bottom: 1px solid #999;
}
.useflex {
  display: flex;
  align-items: center !important;
}
.center {
  margin: 0 auto;
  text-align: center;
}
.margingleft {
  margin-left: 7px;
}
</style>