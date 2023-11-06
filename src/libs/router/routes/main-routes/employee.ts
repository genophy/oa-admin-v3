import { AppRouteRecordRaw } from '../../types';

const employeeRoutes: AppRouteRecordRaw = {
  path: 'employee',
  name: 'Employee',
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '员工',
  },
  children: [
    {
      path: 'employee-post-list',
      name: 'EmployeePostList',
      meta: {
        title: '岗位管理',
      },
      component: () => import('/@/views/pages/employee/onboard/EmployeePostList.vue'),
    },
    {
      path: 'newcomer-resume-list',
      name: 'NewcomerResumeList',
      meta: {
        title: '简历管理',
      },
      component: () => import('/@/views/pages/employee/onboard/NewcomerResumeList.vue'),
    },
    {
      path: 'newcomer-interview-list',
      name: 'NewcomerInterviewList',
      meta: {
        title: '面试管理',
      },
      component: () => import('/@/views/pages/employee/onboard/NewcomerInterviewList.vue'),
    },
  ],
};

export default employeeRoutes;
