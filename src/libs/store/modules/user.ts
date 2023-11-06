import { ElMessageBox } from 'element-plus';
import { defineStore } from 'pinia';
import { useMenusStoreWithOut } from './menus';
import { ErrorMessageMode } from '/#/axios';
import type { LoginCache, UserInfo } from '/#/store';
import { AuthController } from '/@/api';
import { LOGIN_INFO_KEY, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/libs/enums/cacheEnum';
import { PageEnum } from '/@/libs/enums/pageEnum';
import { RoleEnum } from '/@/libs/enums/roleEnum';
import { useI18n } from '/@/libs/hooks/web/useI18n';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { router } from '/@/libs/router';
import { store } from '/@/libs/store';
import { getAuthCache, setAuthCache } from '/@/libs/utils/auth';
import { createLocalStorage } from '/@/libs/utils/cache';

const ls = createLocalStorage();

interface UserState {
  loginCache: Nullable<LoginCache>; // 用户登录的用户名及密码（缓存 ）
  userInfo: Nullable<UserInfo>; // 用户登录信息
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    loginCache: null,
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getLoginCache(): LoginCache {
      return this.loginCache || ls.get(LOGIN_INFO_KEY) || {};
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setLoginCache(info: LoginCache | null) {
      this.loginCache = info;
      ls.set(LOGIN_INFO_KEY, this.loginCache);
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, this.token);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },

    /**
     * @description: login
     */
    async login(
      params: any & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { goHome = true, mode, validImageId, ...loginParams } = params;
        const data = await AuthController.authLogin(loginParams, mode, { headers: { 'valid-image-id': validImageId } });
        const { token, user, menus } = data; // {token, user, menus}

        this.setToken(token);
        return this.afterLoginAction(user, goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(user, goHome?: boolean): Promise<any | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = user || null; // await this.fetchUserInfo();
      // 保存用户信息
      this.setUserInfo(userInfo);
      const menusStore = useMenusStoreWithOut();
      // menusStore.setMenus(menus);
      await menusStore.initMenusPermission();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      }
      // else {
      // const permissionStore = usePermissionStore();
      // if (!permissionStore.isDynamicAddedRoute) {
      //   const routes = await permissionStore.buildRoutesAction();
      //   routes.forEach((route) => {
      //     router.addRoute(route as unknown as RouteRecordRaw);
      //   });
      //   router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
      //   permissionStore.setDynamicAddedRoute(true);
      // }
      // goHome && (await router.replace(PageEnum.MAIN_HOME));
      // }
      goHome && (await router.replace(PageEnum.MAIN_HOME));
      return userInfo;
    },
    /**
     * 获取用户信息
     * @returns
     */
    async fetchUserInfo(): Promise<UserInfo | null> {
      try {
        //account  flag  id  name   phone roleId
        // 查找用户信息
        const { user } = await AuthController.auth({}, 'message');
        const userInfo: UserInfo = user || null;
        // 保存用户信息
        this.setUserInfo(userInfo);
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: logout
     */
    async logout(goLogin = false) {

      if (this.getToken) {
        try {
          await this.doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      ElMessageBox.close();
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);

      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    async doLogout() {
      await AuthController.authLogout();
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();

      return createConfirm(
        t('sys.warmTips'),
        t('sys.logoutMessage'),
        async () => {
          await this.logout(true);
        },
        { type: 'warning' },
      );
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
