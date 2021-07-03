import Vue from 'vue'
import VueRouter from 'vue-router'
//components
import Login from '../components/Login.vue'
//children
import Home from '../views/Home/Home.vue'
import helloPage from '../views/Home/childrenPage/helloPage.vue'
import User from '../views/Home/childrenPage/User.vue'
import Roles from '../views/Home/childrenPage/Roles.vue'
import Rights from '../views/Home/childrenPage/Rights.vue'
import Orders from '../views/Home/childrenPage/Orders.vue'
import Reports from '../views/Home/childrenPage/Reports.vue'
//shop
import Categories from '../views/Home/childrenPage/shop/Categories.vue'
import Goods from '../views/Home/childrenPage/shop/Goods.vue'
import Params from '../views/Home/childrenPage/shop/Params.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', component: helloPage },
    { path: '/users', component: User },
    { path: '/roles', component: Roles },
    { path: '/rights', component: Rights },
    { path: '/categories', component: Categories },
    { path: '/goods', component: Goods },
    { path: '/params', component: Params },
    { path: '/orders', component: Orders },
    { path: '/reports', component: Reports}

    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
