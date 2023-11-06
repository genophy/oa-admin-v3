import type { Router } from 'vue-router';
import { PageEnum } from '/@/libs/enums/pageEnum';
import { useUserStoreWithOut } from '/@/libs/store/modules/user';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const MAIN_WELCOME = PageEnum.MAIN_WELCOME;

const whitePathList: PageEnum[] = [LOGIN_PATH];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    const token = userStore.getToken;

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout;
        try {
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/');
            return;
          }
        } catch {}
      }
      next();
      return;
    }

    // token does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };

      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.fetchUserInfo();
      } catch (err) {
        next();
        return;
      }
    }
    // 进入欢迎页，并且有redirect
    if (from.path === LOGIN_PATH && to.path === MAIN_WELCOME && from.query.redirect && to.path !== from.query.redirect) {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      next(redirect);
    } else {
      next();
    }
  });
}
