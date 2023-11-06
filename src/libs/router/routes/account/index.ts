import { LOGIN_PAGE } from '../../constant';
import { AppRouteRecordRaw } from '../../types';

export const AccountRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'LoginPage',
  component: LOGIN_PAGE,
  meta: {
    icon: 'ion:home-outline',
    title: '登录页',
  },
};
