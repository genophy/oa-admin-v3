import { AppRouteRecordRaw } from '../../types';

const affairsRoutes: AppRouteRecordRaw = {
  path: 'affairs',
  name: 'Affairs',
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '行政事务',
  },
  children: [
    {
      path: 'meeting-room-list',
      name: 'MeetingRoomList',
      meta: {
        title: '会议室管理',
      },
      component: () => import('/@/views/pages/affairs/meeting/MeetingRoomList.vue'),
    },
    {
      path: 'meeting-appointment-overview',
      name: 'MeetingAppointmentOverview',
      meta: {
        title: '会议预约管理',
      },
      component: () => import('/@/views/pages/affairs/meeting/MeetingAppointmentOverview.vue'),
    },

    {
      path: 'car-list',
      name: 'CarList',
      meta: {
        title: '所有车辆',
      },
      component: () => import('/@/views/pages/affairs/car/CarList.vue'),
    },
    {
      path: 'car-appointment-overview',
      name: 'CarAppointmentOverview',
      meta: {
        title: '车辆申请管理',
      },
      component: () => import('/@/views/pages/affairs/car/CarAppointmentOverview.vue'),
    },
  ],
};

export default affairsRoutes;
