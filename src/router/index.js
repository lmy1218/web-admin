import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '@/views/login.vue'
import home from '@/views/home.vue'
import welcome from '@/components/welcome.vue'
import userlist from '@/components/userlist.vue'
import edituser from '@/components/edituser.vue'


Vue.use(VueRouter)

  const routes = [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/home",
      name: "home",
      component: home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          name: "welcome",
          component: welcome
        },
        {
          path: "/user",
          name: "user",
          component: userlist
        },
        {
          path: "/rights",
          name: "rights",
          component: edituser
        }
      ]
    }
  ]

const router = new VueRouter({
  routes
})

// 挂载路由导航
router.beforeEach((to, from, next) => {
  // 放行登录页
  if(to.path == '/login') return next();
  // 从storage中获取用户信息
  const userCa = window.sessionStorage.getItem("user");
  // 未登录
  if(!userCa) return next({path:'/login'});
  next();
})

export default router
