import type { Router } from 'vue-router';
import { useAppStore } from '/@/libs/store/modules/app';
import { useMultipleTabStore } from '/@/libs/store/modules/multipleTab';
import { useUserStore } from '/@/libs/store/modules/user';
// import { usePermissionStore } from '/@/libs/store/modules/permission';
import { PageEnum } from '/@/libs/enums/pageEnum';
import { removeTabChangeListener } from '/@/libs/logics/mitt/routeChange';
import { closeDynDialog, removeCloseDynDialog } from '../../logics/mitt/dynDialogClose';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    closeDynDialog();

    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      removeCloseDynDialog();
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const appStore = useAppStore();
      // const permissionStore = usePermissionStore();
      appStore.resetAllState();
      // permissionStore.resetState();
      tabStore.resetState();
      userStore.resetState();
      removeTabChangeListener();
    }
  });
}
