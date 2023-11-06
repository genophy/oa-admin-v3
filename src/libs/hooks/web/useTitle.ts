import { useTitle as usePageTitle } from '@vueuse/core';
import { unref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobSetting } from '/@/libs/hooks/setting';
import { useI18n } from '/@/libs/hooks/web/useI18n';
import { useLocaleStore } from '/@/libs/store/modules/locale';

import { useMenusStoreWithOut } from '../../store/modules/menus';
import { REDIRECT_NAME } from '/@/libs/router/constant';
import { useWebsiteConfigStore } from '/@/libs/store/modules/websiteConfig';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { title } = useGlobSetting();

  const websiteConfigStore = useWebsiteConfigStore();

  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();

  const pageTitle = usePageTitle();

  const updatePageTitle = () => {
    const route = unref(currentRoute);

    if (route.name === REDIRECT_NAME) {
      return;
    }

    const menuStore = useMenusStoreWithOut();
    const mObj: any = menuStore.getMenusSeq.filter((i: any) => i.url === route.fullPath);

    const websiteName = websiteConfigStore.getWebsiteInfo?.siteName || title;
    const tTitle = mObj?.name || t(route?.meta?.title as string);
    pageTitle.value = tTitle ? ` ${tTitle} - ${websiteName} ` : `${websiteName}`;
  };

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      updatePageTitle();
    },
    { immediate: true },
  );

  return { updatePageTitle };
}
