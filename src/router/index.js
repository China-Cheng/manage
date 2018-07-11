import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '../views/users/user';
import Rights from '@/views/roles/Rights';

Vue.use(Router);
export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
});
