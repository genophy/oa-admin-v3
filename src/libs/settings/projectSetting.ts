import { CollapseTriggerEnum } from '/@/libs/enums/menuEnum';
import type { ProjectConfig } from '/#/config';
import {
  PermissionModeEnum,
  RouterTransitionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/libs/enums/appEnum';
import { CacheTypeEnum } from '/@/libs/enums/cacheEnum';

const setting: ProjectConfig = {
  // 支持夜间模式
  showDarkModeToggle: true,

  // 权限模式
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // 权限缓存方式
  permissionCacheType: CacheTypeEnum.LOCAL,

  // 会话超时处理方式
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 是否灰色模式（特殊日期，需要置灰整个网站）
  grayMode: false,

  // 是否显示logo
  showLogo: true,

  // 是否显示底部
  showFooter: false,

  // 头部设置
  headerSetting: {
    // Whether to show top
    show: true,
    // Whether to show the notification button
    showNotice: true,
    // Whether to display the menu search
    showSearch: true,
  },

  // 菜单设置
  menuSetting: {
    // Menu collapse
    collapsed: false,
    // 菜单是否只允许打开一个一级
    uniqueOpened: true,
    // When sider hide because of the responsive layout
    siderHidden: false,
    // 侧边切换位置
    collapseTrigger: CollapseTriggerEnum.HEADER,
    // Whether to show no dom
    show: true,
    // 是否显示图标
    showIcon: true,
    // Menu width
    menuWidth: 210,
  },

  // tabs二级菜单栏目
  multiTabsSetting: {
    cache: false,
    // Turn on
    show: true,
    // Turn on quick actions
    showQuick: true,
    // 是否可拖拽
    canDrag: true,
    // 是否可刷新当前路由
    showRedo: true,
  },

  // 路由切换动画
  transitionSetting: {
    //  Whether to open the page switching animation
    // The disabled state will also disable pageLoading
    enable: true,

    // Route basic switching animation
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // Whether to open page switching loading
    // Only open when enable=true
    openPageLoading: true,

    // Whether to open the top progress bar
    openNProgress: false,
  },

  // 是否保持路由
  openKeepAlive: false,

  // 是否显示面包屑
  showBreadCrumb: true,

  // 是否显示面包屑图标
  showBreadCrumbIcon: false,

  // 是否使用错误处理
  useErrorHandle: false,

  // 是否显示一键滚动到顶部
  useOpenBackTop: true,

  // 是否嵌入iframe
  canEmbedIFramePage: true,

  // 是否切换界面时，关闭消息
  closeMessageOnSwitch: true,

  // 是否切换界面时，移除所有未结束的http
  removeAllHttpPending: true,
};

export default setting;
