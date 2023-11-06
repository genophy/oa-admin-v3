import { useDebounceFn } from '@vueuse/core';
import type { App, Directive } from 'vue';
import { addResizeListener, removeResizeListener } from '../utils/event';

let vFn = (_sizeObj) => {};

const resizeFn = (el) => {
  return useDebounceFn(() => {
    const { offsetWidth, offsetHeight } = el || {};
    if (vFn && typeof vFn === 'function') vFn({ width: offsetWidth, height: offsetHeight });
  }, 200);
};

const resizeDirective: Directive = {
  mounted(el, binding) {
    vFn = binding.value;
    addResizeListener(el, resizeFn(el));
  },
  unmounted(el) {
    removeResizeListener(el, resizeFn(el));
  },
};

export function setupResizeDirective(app: App) {
  app.directive('resize', resizeDirective);
}

export default resizeDirective;
