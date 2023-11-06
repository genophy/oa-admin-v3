// 菜单类型
export enum menuTypeEnum {
  // 目录
  'folder' = 'folder',
  // 路由菜单
  'route' = 'route',
  // 内嵌iframe
  'iframe' = 'iframe',
  // 跳转外链
  'redirect' = 'redirect',
  // 按钮
  'button' = 'button',
}

// 侧边菜单文字折叠按钮位置
export enum CollapseTriggerEnum {
  // 不显示
  NONE = 'NONE',
  // 头部
  HEADER = 'HEADER',
  // 侧边右边
  SIDER_LEFT = 'SIDER_RIGHT',
}
