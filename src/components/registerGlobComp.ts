import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import type { App } from 'vue';

export function registerGlobComp(app: App) {
  app.use(ElementPlus, { locale: zhCn, size: 'large', zIndex: 1000 });
}
