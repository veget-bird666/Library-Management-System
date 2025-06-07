import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import UserView from '../views/UserView.vue'
import AdminLayout from '../layout/AdminLayout.vue'
import Books        from '../views/Books.vue'
import UserBooks    from '../views/UserBooks.vue'
import UserLayout from '@/layout/UserLayout.vue'
import Borrow from '@/views/Borrow.vue'
import UserManage from '@/views/UserManage.vue'
import TypeManage from '@/views/TypeManage.vue' 
import AnnouncementManage from '@/views/AnnouncementManage.vue'
import AdminManage from '@/views/AdminManage.vue'
import UserBorrow from '@/views/UserBorrow.vue'
import UserAnnouncement from '@/views/UserAnnouncement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      children: [
        {
          path: 'borrow',
          name: 'admin-borrow',
          component:Borrow
        },
        {
          path: 'books',
          name: 'admin-books',
          component: Books,
        },
        {
          path: 'readers',
          name: 'admin-readers',
          component: UserManage
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: TypeManage
        },
        {
          path: 'announcements',
          name: 'admin-announcements',
          component: AnnouncementManage
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: AdminManage
        },
        {
          path: 'statistics',
          name: 'admin-statistics',
          component: AdminView
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: UserLayout,
      children: [
        {
          path: '',
          name: 'user-home',
          component: UserView
        },
        {
          path: 'books',
          name: 'user-books',
          component: UserBooks
        },
        {
          path: 'borrow',
          name: 'user-borrow',
          component: UserBorrow
        },
        {
          path: 'function3',
          name: 'user-function3',
          component: UserAnnouncement
        }
      ]
    }
  ]
})

export default router
