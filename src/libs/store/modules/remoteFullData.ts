import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { ErrorMessageMode } from '/#/axios';
import { store } from '/@/libs/store';
import { AnnouncementController, DepartmentController, MenuController, RoleController } from '/@/api';
import { tree2list } from '../../utils/langUtil';

/**
 * 不分页数据
 */

interface RemoteFullDataState {
  roles: any[]; // 不分页角色
  deptTree: any[]; // 不分页角色
  menus: any[]; // 菜单树
  menusSeq: any[]; // 菜单树序列
  announcementIdsRead: any[]; // 已读公告 id
}

export const useRemoteFullDataStore = defineStore({
  id: 'app-remote-full-data',
  state: (): RemoteFullDataState => ({
    roles: [],
    deptTree: [],
    menus: [],
    menusSeq: [],
    announcementIdsRead: [],
  }),
  getters: {
    getRoles(): any[] {
      return this.roles || [];
    },
    getDeptTree(): any[] {
      return this.deptTree || [];
    },
    getMenus(): any[] {
      return this.menus || [];
    },
    getMenusSeq(): any[] {
      return this.menusSeq || [];
    },
    getAnnouncementIdsRead(): any[] {
      return this.announcementIdsRead || [];
    },
  },
  actions: {
    /**
     * 查询角色
     * @returns
     */
    queryRoles(errorMessageMode: ErrorMessageMode = 'none') {
      return RoleController.roleListAll({}, errorMessageMode)
        .then((data) => {
          this.roles = data.list || [];
        })
        .catch(() => {
          this.roles = [];
        });
    },
    /**
     * 查询组织树
     * @param errorMessageMode
     * @returns
     */
    queryDeptTree(errorMessageMode: ErrorMessageMode = 'none') {
      return DepartmentController.departmentTree({}, errorMessageMode)
        .then((data) => {
          this.deptTree = data || [];
        })
        .catch(() => {
          this.deptTree = [];
        });
    },
    /**
     * 查询当前用户菜单
     * @returns
     */
    queryMenuTree(errorMessageMode: ErrorMessageMode = 'none') {
      return MenuController.menuTree({}, errorMessageMode)
        .then((data) => {
          this.menus = cloneDeep(data);
          this.menusSeq = tree2list(this.menus, (child, parent) => {
            if (!parent) return null;
            //  除了父级子集，都缓存起来
            const _pMenu = cloneDeep(parent);
            delete _pMenu.children;
            child.parents = [...(child.parents || []), _pMenu];
            return child;
          });
        })
        .catch(() => {
          this.menus = [];
          this.menusSeq = [];
        });
    },

    /**
     * 当前用户已读公告 id 列表
     * @param errorMessageMode
     */
    queryAnnouncementIdsRead(errorMessageMode: ErrorMessageMode = 'none') {
      return AnnouncementController.announcementQueryIdsOfRead({}, errorMessageMode)
        .then((data) => {
          this.announcementIdsRead = cloneDeep(data.ids);
        })
        .catch(() => {
          this.announcementIdsRead = [];
        });
    },
  },
});

// Need to be used outside the setup
export function useRemoteFullDataStoreWithOut() {
  return useRemoteFullDataStore(store);
}
