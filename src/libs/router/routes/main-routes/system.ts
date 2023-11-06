import type { AppRouteRecordRaw } from '/@/libs/router/types';

const systemRoutes: AppRouteRecordRaw = {
  path: 'system',
  name: 'System',
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '菜单',
  },
  children: [
    {
      path: 'announcement-mgt',
      name: 'AnnouncementMgt',
      meta: {
        title: '公告管理',
        adminOnly: true,
      },
      component: () => import('/@/views/pages/system/AnnouncementMgt.vue'),
    },
    {
      path: 'dept-list',
      name: 'DeptList',
      meta: {
        title: '部门管理',
      },
      component: () => import('/@/views/pages/system/DeptList.vue'),
    },
    {
      path: 'user-list',
      name: 'UserList',
      meta: {
        title: '登录用户',
      },
      component: () => import('/@/views/pages/system/UserList.vue'),
    },
    {
      path: 'role-list',
      name: 'RoleList',
      meta: {
        title: '角色管理',
      },
      component: () => import('/@/views/pages/system/RoleList.vue'),
    },
    {
      path: 'menu-list',
      name: 'MenuList',
      meta: {
        title: '菜单管理',
        adminOnly: true,
      },
      component: () => import('/@/views/pages/system/MenuList.vue'),
    },
    // {
    //   path: 'configure',
    //   name: 'Configure',
    //   meta: {
    //     title: '系统配置',
    //   },
    //   component: () => import('../../../../layouts/main-page/components/SystemSetting.vue'),
    // },
  ],
};

export default systemRoutes;
