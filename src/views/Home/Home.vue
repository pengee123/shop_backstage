<template>
  <div>
    <el-container class="home-container">
      <el-header>
        <div>
          <span>后台管理系统</span>
        </div>
        <el-button type="warning" plain @click="logout" class="logbtn"
          >退出登录</el-button
        >
      </el-header>
      <el-container>
        <el-aside :width="islong ? '64px' : '200px'">
          <div class="togglebtn" @click="togglebtnclick">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="islong"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 第一个选项框 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in listMenu"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 第一个选项框的二级菜单 -->
              <el-menu-item
                :index="'/' + subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="activeNavPath('/' + subitem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span> {{ subitem.authName }}</span></template
                >
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      listMenu: [],
      iconsObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      islong: false,
      activePath: '',
    };
  },
  created() {
    this.getListMenu();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      this.$router.push("/login");
      window.sessionStorage.clear();
      this.$message.success("已退出");
    },
    async getListMenu() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.meg);
      this.listMenu = res.data;
    },
    togglebtnclick() {
      this.islong = !this.islong;
    },
    activeNavPath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #999999;
  padding-left: 5px;
  > div {
    display: flex;
    font-size: 31px;
    color: cornsilk;
    // line-height: 100%;
    align-items: center;
  }
}
.el-aside {
  background-color: #545c64;
  overflow: hidden;
}
.el-main {
  background-color: #fff;
}
.logbtn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 100px;
}
.el-menu {
  width: 100%;
}
.togglebtn {
  background-color: #585555;
  text-align: center;
  cursor: pointer;
  letter-spacing: 2px;
}
</style>