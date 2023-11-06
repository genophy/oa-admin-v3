import { genMessage } from '../helper';

import elementLocale from 'element-plus/dist/locale/en.mjs';

const modules = import.meta.globEager('./en/**/*.ts');

export default {
  message: {
    ...genMessage(modules, 'en'),
    elementLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
