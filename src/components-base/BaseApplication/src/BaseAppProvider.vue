<script lang="ts">
import { defineComponent, ref, toRefs, unref } from 'vue';
import { createAppProviderContext } from './useAppContext';
import { screenEnum } from '/@/libs/enums/breakpointEnum';
import { createBreakpointListen } from '/@/libs/hooks/event/useBreakpoint';
import { prefixCls } from '/@/libs/settings/designSetting';
import { useAppStore } from '/@/libs/store/modules/app';
import { useTitle } from '/@/libs/hooks/web/useTitle';
import { useWebsiteConfigStore } from '/@/libs/store/modules/websiteConfig';

const props = {
  /**
   * class style prefix
   */
  prefixCls: { type: String, default: prefixCls },
};

export default defineComponent({
  name: 'BaseAppProvider',
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const isMobile = ref(false);
    const isSetState = ref(false);

    const appStore = useAppStore();

    // Monitor screen breakpoint information changes
    createBreakpointListen(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.LG);
      if (lgWidth) {
        isMobile.value = width.value - 1 < lgWidth;
        if (lgWidth >= screenEnum.XXL) {
          appStore.setScreenLVMode(sizeEnum.XXL);
        } else if (lgWidth >= screenEnum.XL) {
          appStore.setScreenLVMode(sizeEnum.XL);
        } else if (lgWidth >= screenEnum.LG) {
          appStore.setScreenLVMode(sizeEnum.LG);
        } else if (lgWidth >= screenEnum.MD) {
          appStore.setScreenLVMode(sizeEnum.MD);
        } else if (lgWidth >= screenEnum.SM) {
          appStore.setScreenLVMode(sizeEnum.SM);
        } else {
          appStore.setScreenLVMode(sizeEnum.XS);
        }
      }
      appStore.setMobileMode(isMobile.value);
      handleRestoreState();
    });

    const { prefixCls } = toRefs(props);

    // Inject variables into the global
    createAppProviderContext({ prefixCls, isMobile });

    /**
     * Used to maintain the state before the window changes
     */
    function handleRestoreState() {
      if (unref(isMobile)) {
        if (!unref(isSetState)) {
          isSetState.value = true;
          const { menuSetting } = appStore.getProjectConfig;
          const menuCollapsed = menuSetting?.collapsed ?? true;

          appStore.setBeforeMiniInfo({ menuCollapsed });
        }
      } else {
        if (unref(isSetState)) {
          isSetState.value = false;
          const { menuCollapsed } = appStore.getBeforeMiniInfo;
          appStore.setProjectConfig({
            menuSetting: {
              collapsed: menuCollapsed,
            },
          });
        }
      }
    }

    // 网站信息
    const websiteConfigStore = useWebsiteConfigStore();
    // 更新头部icon
    websiteConfigStore.updateLogoIcon();

    const { updatePageTitle } = useTitle();

    // 查询网站配置;
    websiteConfigStore.queryWebsiteInfo().finally(() => {
      updatePageTitle();
    });

    return () => slots.default?.();
  },
});
</script>
