import { genMessage } from '../helper';

import elementLocale from 'element-plus/dist/locale/zh-cn.mjs';

const modules = import.meta.globEager('./zh-CN/**/*.ts');

export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    elementLocale,
  },
};
