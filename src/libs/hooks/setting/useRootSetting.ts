import type { ProjectConfig } from '/#/config';

import { computed } from 'vue';

import { ThemeEnum } from '/@/libs/enums/appEnum';
import { useAppStore } from '/@/libs/store/modules/app';

type RootSetting = Omit<ProjectConfig, 'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'>;

export function useRootSetting() {
  const appStore = useAppStore();

  const getPageLoading = computed(() => appStore.getPageLoading);

  const getMobileMode = computed(() => appStore.getMobileMode);

  const getOpenKeepAlive = computed(() => appStore.getProjectConfig.openKeepAlive);

  const getCanEmbedIFramePage = computed(() => appStore.getProjectConfig.canEmbedIFramePage);

  const getPermissionMode = computed(() => appStore.getProjectConfig.permissionMode);

  const getShowLogo = computed(() => appStore.getProjectConfig.showLogo);

  const getUseOpenBackTop = computed(() => appStore.getProjectConfig.useOpenBackTop);

  const getUseErrorHandle = computed(() => appStore.getProjectConfig.useErrorHandle);

  const getShowFooter = computed(() => appStore.getProjectConfig.showFooter);

  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb);

  const getShowBreadCrumbIcon = computed(() => appStore.getProjectConfig.showBreadCrumbIcon);

  const getGrayMode = computed(() => appStore.getProjectConfig.grayMode);

  const getShowDarkModeToggle = computed(() => appStore.getProjectConfig.showDarkModeToggle);

  const getDarkMode = computed(() => appStore.getDarkMode);

  function setRootSetting(setting: Partial<RootSetting>) {
    appStore.setProjectConfig(setting);
  }

  function setDarkMode(mode: ThemeEnum) {
    appStore.setDarkMode(mode);
  }

  /**
   * 菜单是否侧边折叠
   */
  const IsMenuCollapsed = computed({
    get() {
      return appStore.getProjectConfig.menuSetting.collapsed;
    },
    set(newValue: boolean) {
      appStore.setProjectConfig({ menuSetting: { collapsed: newValue } });
    },
  });

  // 是否是深色模式
  const IsThemeDark = computed({
    get() {
      return appStore.getDarkMode === ThemeEnum.DARK;
    },
    set(newValue: boolean) {
      appStore.setDarkMode(newValue ? ThemeEnum.DARK : ThemeEnum.LIGHT);
    },
  });

  return {
    setRootSetting,
    getMobileMode,
    getGrayMode,
    getPageLoading,
    getOpenKeepAlive,
    getCanEmbedIFramePage,
    getPermissionMode,
    getShowLogo,
    getUseErrorHandle,
    getShowBreadCrumb,
    getShowBreadCrumbIcon,
    getUseOpenBackTop,
    getShowFooter,
    getDarkMode,
    setDarkMode,
    getShowDarkModeToggle,
    IsMenuCollapsed,
    IsThemeDark,
  };
}
