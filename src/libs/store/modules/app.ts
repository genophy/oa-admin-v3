import projectSetting from '/@/libs/settings/projectSetting';
import type { ProjectConfig, HeaderSetting, MenuSetting, TransitionSetting, MultiTabsSetting } from '/#/config';
import type { BeforeMiniState } from '/#/store';

import { defineStore } from 'pinia';
import { store } from '/@/libs/store';

import { ThemeEnum } from '/@/libs/enums/appEnum';
import { APP_DARK_MODE_KEY_, PROJ_CFG_KEY } from '/@/libs/enums/cacheEnum';
import { Persistent } from '/@/libs/utils/cache/persistent';
import { darkMode } from '/@/libs/settings/designSetting';
import { resetRouter } from '/@/libs/router';
import { deepMerge } from '/@/libs/utils';
import { screenEnum, screenMap, sizeEnum } from '/@/libs/enums/breakpointEnum';
import { minMax } from '/@/libs/utils/langUtil';

interface AppState {
  fullPage: boolean;

  // 屏幕档位  XS SM MD LG XL XXL
  screenLVMode: sizeEnum;

  // 屏幕档位宽度 XS:480 SM:576 MD:768 LG:992 XL:1200 XXL:1600
  screenLVWidth: number;
  // 是否是手机模式，当宽度小于screenEnum.MD
  mobileMode: boolean;
  // 夜间模式
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
}
let timeId: TimeoutHandle;
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    fullPage: false,
    screenLVMode: sizeEnum.XL,
    screenLVWidth: screenEnum.XL,

    mobileMode: false,
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY) || projectSetting,
    beforeMiniInfo: {},
  }),
  getters: {
    getFullPage(): boolean {
      return this.fullPage;
    },
    getScreenLVMode(): sizeEnum {
      return this.screenLVMode;
    },
    getScreenLVWidth(): number {
      return this.screenLVWidth;
    },
    getDrawerWidth(): number {
      return minMax(this.screenLVWidth - 20, 340, 400);
    },
    getMobileMode(): boolean {
      return this.mobileMode;
    },
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getDarkMode(): 'light' | 'dark' | string {
      return this.darkMode || localStorage.getItem(APP_DARK_MODE_KEY_) || darkMode;
    },

    getBeforeMiniInfo(): BeforeMiniState {
      return this.beforeMiniInfo;
    },

    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig);
    },

    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting;
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting;
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting;
    },
  },
  actions: {
    setFullPage(isFullPage: boolean): void {
      this.fullPage = isFullPage;
    },
    setScreenLVMode(mode: sizeEnum): void {
      this.screenLVMode = mode;
      this.screenLVWidth = screenMap.get(mode) as any;
    },
    setMobileMode(isMobile: boolean): void {
      this.mobileMode = isMobile;
    },
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode;
      localStorage.setItem(APP_DARK_MODE_KEY_, mode);
    },

    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state;
    },

    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },

    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId);
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading);
        }, 50);
      } else {
        this.setPageLoading(loading);
        clearTimeout(timeId);
      }
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
