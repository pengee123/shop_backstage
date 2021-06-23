import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home/Home.vue'
import helloPage from '../views/Home/childrenPage/helloPage.vue'
import User from '../views/Home/childrenPage/User.vue'
import Roles from '../views/Home/childrenPage/Roles.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login'},
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{path: '/welcome', component: helloPage},
               {path: '/users', component: User},
               {path: '/roles', component: Roles}
    
  ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  if(to.path === '/login') next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router
