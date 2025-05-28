import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import UserView from '../views/UserView.vue'
import AdminLayout from '../layout/AdminLayout.vue'
import Books        from '../views/Books.vue'
import UserBooks    from '../views/UserBooks.vue'
import UserLayout from '@/layout/UserLayout.vue'


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
          component: AdminView
        },
        {
          path: 'books',
          name: 'admin-books',
          component: Books,
        }/*,
        {
          path: 'readers',
          name: 'admin-readers',
          component: AdminView
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: AdminView
        },
        {
          path: 'announcements',
          name: 'admin-announcements',
          component: AdminView
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: AdminView
        },
        {
          path: 'statistics',
          name: 'admin-statistics',
          component: AdminView
        }*/
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
          path: 'function2',
          name: 'user-function2',
          component: UserView
        },
        {
          path: 'function3',
          name: 'user-function3',
          component: UserView
        }
      ]
    }
  ]
})

export default router
