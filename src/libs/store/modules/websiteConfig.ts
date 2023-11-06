import { defineStore } from 'pinia';
import { ErrorMessageMode } from '/#/axios';

import { WebsiteConfigController } from '/@/api';
import { WebsiteConfigUpdateDto } from '/@/api/dtos';
import defaultBgImg from '/@/assets/img/company01.jpg';
import defaultLogoImg from '/@/assets/img/logo.png';
import { WEBSITE_INFO_KEY } from '/@/libs/enums/cacheEnum';
import { store } from '/@/libs/store';
import { createLocalStorage } from '/@/libs/utils/cache';
import { prefixImgUrl } from '/@/libs/utils/commons';

const ls = createLocalStorage();
interface WebsiteConfigState {
  websiteInfo?: WebsiteConfigUpdateDto | undefined;
}

// const { title } = useGlobSetting();

export const useWebsiteConfigStore = defineStore({
  id: 'app-website-config',
  state: (): WebsiteConfigState => ({
    websiteInfo: {
      siteName: 'OA管理系统',
      siteDesc: 'OA管理系统后台客户端',
      siteIcon: '', // defaultLogoImg,
      siteLogo: '', // defaultLogoImg,
      loginBg: '', // defaultBgImg,
      userDefaultPassword: '123456',
      grayMode: false,
      version: '1.0',
    } as WebsiteConfigUpdateDto,
  }),
  getters: {
    //  灰色
    getGrayMode(): boolean {
      return !!this.getWebsiteInfo?.grayMode;
    },
    // 获取完整的logo地址
    getLogoFullUrl(): string {
      return this.getWebsiteInfo?.siteLogo ? prefixImgUrl(this.getWebsiteInfo.siteLogo) : defaultLogoImg;
    },
    getWebsiteInfo(): WebsiteConfigUpdateDto {
      const _info = this.websiteInfo?.siteName ? this.websiteInfo : ls.get(WEBSITE_INFO_KEY) || {};
      return _info;
    },
  },
  actions: {
    // 设置网站信息
    setWebsiteInfo(info: WebsiteConfigUpdateDto) {
      this.websiteInfo = info;
      this.updateGrayMode();
      ls.set(WEBSITE_INFO_KEY, info);
    },

    // 保存配置
    saveWebsiteInfo(configJson: WebsiteConfigUpdateDto, errorMessageMode: ErrorMessageMode = 'message') {
      this.setWebsiteInfo(configJson);
      return WebsiteConfigController.websiteConfigSetConfig(configJson, errorMessageMode);
    },

    // 查询配置
    async queryWebsiteInfo(errorMessageMode: ErrorMessageMode = 'message') {
      const { config } = await WebsiteConfigController.websiteConfig({}, errorMessageMode, {}, { isTransformResponse: true, ignoreCancelToken: true });
      this.setWebsiteInfo(config);
      this.updateLogoIcon();
      this.updateGrayMode();
      return config;
    },

    // 更新灰色模式
    updateGrayMode() {
      const grayMode = this.getGrayMode;
      if (!!grayMode) {
        document.querySelector('html')?.setAttribute('grayMode', 'true');
      } else {
        document.querySelector('html')?.removeAttribute('grayMode');
      }
    },

    // 更新标题栏图标
    updateLogoIcon() {
      const link: any = document.querySelector("link[rel*='icon']");
      link.href = this.getLogoFullUrl;
    },

    // 重置store
    resetStore() {
      this.websiteInfo = {
        siteName: 'OA管理系统',
        siteDesc: 'OA管理系统后台客户端',
        siteIcon: defaultLogoImg,
        siteLogo: defaultLogoImg,
        loginBg: defaultBgImg,
        userDefaultPassword: '123456',
        version: '1.0',
      } as WebsiteConfigUpdateDto;
    },
  },
});

// Need to be used outside the setup
export function useWebsiteConfigStoreWithOut() {
  return useWebsiteConfigStore(store);
}
