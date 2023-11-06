import { CollapseTriggerEnum, PermissionModeEnum, RouterTransitionEnum, SessionTimeoutProcessingEnum } from '/@/libs/enums/appEnum';

import { CacheTypeEnum } from '/@/libs/enums/cacheEnum';

export type LocaleType = 'zh_CN' | 'en';

export type WordCaseType = 'lower' | 'upper' | 'firstUpper' | 'default';

export interface MenuSetting {
  collapsed: boolean;
  uniqueOpened: boolean;
  siderHidden: boolean;
  collapseTrigger: CollapseTriggerEnum;
  show: boolean;
  showIcon: boolean;
  menuWidth: number;
}

// tab栏目
export interface MultiTabsSetting {
  cache: boolean;
  show: boolean;
  showQuick: boolean;
  // 是否可拖拽
  canDrag: boolean;
  // 是否可刷新当前路由
  showRedo: boolean;
}

export interface HeaderSetting {
  // 是否显示
  show: boolean;
  // 显示提醒
  showNotice: boolean;
  // 显示全局搜索
  showSearch: boolean;
}

// 显示国际化切换
export interface LocaleSetting {
  showPicker: boolean;
  // 当前语言
  locale: LocaleType;
  // 默认语言
  fallback: LocaleType;
  // 可用语言列表
  availableLocales: LocaleType[];
}

// 页面切换动画
export interface TransitionSetting {
  // 是否允许动画
  enable: boolean;
  // 基础切换动画
  basicTransition: RouterTransitionEnum;
  // 打开页面时，显示加载进度
  openPageLoading: boolean;
  // 请求时，显示加载进度
  openNProgress: boolean;
}

export interface ProjectConfig {
  // 是否支持夜间模式
  showDarkModeToggle: boolean;

  // 权限模式
  permissionMode: PermissionModeEnum;
  // 权限缓存方式
  permissionCacheType: CacheTypeEnum;

  // Session过期处理方式
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
  // 是否灰色模式（特殊日期，需要置灰整个网站）
  grayMode: boolean;

  // 是否显示logo
  showLogo: boolean;
  // 是否显示底部
  showFooter: boolean;
  // 头部设置
  headerSetting: HeaderSetting;
  // 菜单设置
  menuSetting: MenuSetting;
  // tabs二级菜单栏目
  multiTabsSetting: MultiTabsSetting;
  // 路由切换动画
  transitionSetting: TransitionSetting;
  // 是否保持路由
  openKeepAlive: boolean;
  // 是否显示面包屑
  showBreadCrumb: boolean;
  // 是否显示面包屑图标
  showBreadCrumbIcon: boolean;
  // 是否使用错误处理
  useErrorHandle: boolean;
  // 是否显示一键滚动到顶部
  useOpenBackTop: boolean;
  // 是否嵌入iframe
  canEmbedIFramePage: boolean;
  // 是否切换界面时，关闭消息
  closeMessageOnSwitch: boolean;
  // 是否切换界面时，移除所有未结束的http
  removeAllHttpPending: boolean;
}

export interface GlobConfig {
  // 网站标题
  title: string;
  // 接口Url
  apiUrl: string;
  // 上传Url
  uploadUrl?: string;
  // Url前缀
  urlPrefix?: string;
  // 项目简略名称
  shortName: string;
}
export interface GlobEnvConfig {
  // 项目端口
  VITE_PORT: number;
  // 网站标题
  VITE_GLOB_APP_TITLE: string;
  // 项目简略名称
  VITE_GLOB_APP_SHORT_NAME: string;
  // 接口Url
  VITE_GLOB_API_URL: string;
  // 上传Url
  VITE_GLOB_UPLOAD_URL?: string;
  // Url前缀
  VITE_GLOB_API_URL_PREFIX?: string;
  // 图片前缀地址
  VITE_GLOB_API_IMAGE_URL_PREFIX?: string;
}
