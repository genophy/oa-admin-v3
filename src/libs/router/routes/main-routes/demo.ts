import type { AppRouteRecordRaw } from '/@/libs/router/types';

const demoRoutes: AppRouteRecordRaw = {
  path: 'demo',
  name: 'Demo',
  meta: {
    orderNo: 10001,
    icon: 'ion:build-outline',
    title: '案例',
  },
  children: [
    {
      path: 'file-demo',
      name: 'FileDemo',
      meta: {
        title: '文件案例',
      },
      children: [
        {
          path: 'big-file-upload-demo',
          name: 'BigFileUploadDemo',
          meta: {
            title: '大文件案例',
          },
          component: () => import('/@/views/demos/file-demo/BigFileUploadDemo.vue'),
        },
        {
          path: 'image-demo',
          name: 'ImageDemo',
          meta: {
            title: '图片案例',
          },
          component: () => import('/@/views/demos/file-demo/ImageDemo.vue'),
        },
      ],
    },
  ],
};

export default demoRoutes;
