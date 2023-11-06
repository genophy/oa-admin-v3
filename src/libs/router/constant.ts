export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';
/**
 * 主页面
 */
export const MAIN_PAGE = () => import('/@/layouts/main-page/index.vue');
/**
 * 登录页
 * @returns
 */
export const LOGIN_PAGE = () => import('/@/views/account/Login.vue');

/**
 * 异常页面
 */
export const EXCEPTION_PAGE = () => import('/@/views/sys/exception/Exception.vue');

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
