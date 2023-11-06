import { defineStore } from 'pinia';
import { unref } from 'vue';
import { store } from '/@/libs/store';
/**
 * 选中元素
 */
interface SingleSelectedState {
  selectedMenu?: any;
  selectedDept?: any;
}

export const useSingleSelectedStore = defineStore({
  id: 'app-single-selected',
  state: (): SingleSelectedState => ({
    selectedMenu: {},
    selectedDept: {},
  }),
  getters: {
    getSelectedMenu(): any {
      return this.selectedMenu || {};
    },
    getSelectedDept(): any {
      return this.selectedDept || {};
    },
  },
  actions: {
    /**
     * 设置选中的菜单
     */
    setSelectedMenu(data: any) {
      this.selectedMenu = unref(data) || {};
    },
    /**
     * 设置选中的部门
     */
    setSelectedDept(data: any) {
      this.selectedDept = unref(data) || {};
    },
  },
});

// Need to be used outside the setup
export function usSingleSelectedStoreWithOut() {
  return useSingleSelectedStore(store);
}
