import type { MenuSetting } from '/#/config';

import { computed, ref, unref } from 'vue';

import { useAppStore } from '/@/libs/store/modules/app';

const mixSideHasChildren = ref(false);

export function useMenuSetting() {
  const appStore = useAppStore();

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  const getMenuType = computed(() => appStore.getMenuSetting.type);

  const getShowMenu = computed(() => appStore.getMenuSetting.show);

  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }

  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !unref(getCollapsed),
    });
  }
  return {
    setMenuSetting,
    toggleCollapsed,
    getMenuType,
    getShowMenu,
    getCollapsed,
    getMenuWidth,
    mixSideHasChildren,
  };
}
