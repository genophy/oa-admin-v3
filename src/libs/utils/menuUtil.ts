import { find } from 'lodash-es';
import { useMenusStore } from '../store/modules/menus';
import { MenuItem } from '/#/store';

const menusStore = useMenusStore();

/**
 * 路由path 转化成菜单
 *
 * @param {*} route
 * @return {*}  {Nullable<MenuItem>}
 */
export const resolveMenuItemFromRoute = (route: any): Nullable<MenuItem> => {
  const fullPath = route.fullPath;
  const frameSrc = route.query?.src;

  if (!fullPath && !frameSrc) return null;

  const menusSeq = menusStore.getMenusSeq;
  const menu =
    (find(menusSeq, (item: any) => {
      return item.url && (item.url === fullPath || item.url === frameSrc);
    }) as MenuItem) || null;

  return menu;
};
