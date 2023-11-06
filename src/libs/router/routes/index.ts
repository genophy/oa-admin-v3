import { EXCEPTION_PAGE, MAIN_PAGE, PAGE_NOT_FOUND_NAME, REDIRECT_NAME } from '../constant';
import { AppRouteRecordRaw } from './../types';
import { AccountRoute } from './account';
import { PageEnum } from '/@/libs/enums/pageEnum';

const mainRoutes: any = import.meta.globEager('./main-routes/**/*.ts');
const mainRouteModuleList: AppRouteRecordRaw[] = [];

// 加入到路由集合中
Object.keys(mainRoutes).forEach((key) => {
  const mod = mainRoutes[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  mainRouteModuleList.push(...modList);
});

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.MAIN_HOME,
  meta: {
    title: '首页',
  },
};

export const MainRoute: AppRouteRecordRaw = {
  path: PageEnum.MAIN_HOME,
  name: 'MainRoute',
  component: MAIN_PAGE,
  meta: {
    title: '首页',
  },
  children: [
    {
      path: '',
      name: 'MainWelcomePageRedirect',
      redirect: '/main/welcome',
      meta: {
        title: '欢迎',
      },
    },
    {
      path: 'welcome',
      name: 'MainWelcomePage',
      component: () => import('/@/views/utils/WelcomePage.vue'),
      meta: {
        title: '欢迎',
        hideTab: true,
        hideBreadcrumb: true,
      },
    },
    {
      path: 'iframe',
      name: 'IframePage',
      component: () => import('/@/views/sys/iframe/index.vue'),
      meta: {
        title: '外链',
      },
    },
    ...mainRouteModuleList,
  ],
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: MAIN_PAGE,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('/@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: MAIN_PAGE,
  meta: {
    title: 'ErrorPage',
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_PAGE,
      meta: {
        title: 'ErrorPage',
      },
    },
  ],
};

export const basicRoutes = [RootRoute, AccountRoute, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE, MainRoute];
