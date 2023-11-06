import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { MenuItem } from '/#/store';
import { MENUS_KEY, MENUS_SEQ_KEY } from '/@/libs/enums/cacheEnum';
import { store } from '/@/libs/store';
import { createLocalStorage } from '/@/libs/utils/cache';

import { tree2list } from '/@/libs/utils/langUtil';
import { MenuController } from '/@/api';

const ls = createLocalStorage();

interface MenusState {
  menus?: MenuItem[];
  menusSeq?: MenuItem[];
  activateMenu: Nullable<MenuItem>;
}

export const useMenusStore = defineStore({
  id: 'app-menus',
  state: (): MenusState => ({
    menus: [],
    menusSeq: [],
    activateMenu: {} as Nullable<MenuItem>,
  }),
  getters: {
    getMenus(): MenuItem[] {
      return this.menus || ls.get(MENUS_KEY, []);
    },

    getMenusSeq(): MenuItem[] {
      return this.menusSeq || ls.get(MENUS_SEQ_KEY, []);
    },

    getActivateMenu(): Nullable<MenuItem> {
      return this.activateMenu ?? ({} as MenuItem);
    },
  },
  actions: {
    /**
     * 设置菜单列表
     * @param menus
     */
    setMenus(menus: MenuItem[]) {
      this.menus = menus || [];
      ls.set(MENUS_KEY, this.menus);

      // 设置 menusSeq值
      this.menusSeq = tree2list(this.menus, (child, parent) => {
        if (!parent) return null;
        //  除了父级子集，都缓存起来
        const _pMenu = cloneDeep(parent);
        delete _pMenu.children;
        child.parents = [...(child.parents || []), _pMenu];
        return child;
      });
      ls.set(MENUS_SEQ_KEY, this.menusSeq);
    },

    /**
     * 当前打开的菜单
     * @param menu
     */
    setActivateMenu(menu: Nullable<MenuItem>) {
      this.activateMenu = menu ?? ({} as MenuItem);
    },

    /**
     * 获取当前登录用户菜单权限
     * @param _cache
     */
    async initMenusPermission() {
      const menus = await MenuController.menuTree();
      this.setMenus(menus);
      return true;
    },
  },
});

// Need to be used outside the setup
export function useMenusStoreWithOut() {
  return useMenusStore(store);
}
