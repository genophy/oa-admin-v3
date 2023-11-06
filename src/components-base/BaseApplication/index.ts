import { withInstall } from '/@/libs/utils';

import baseAppLocalePicker from './src/BaseAppLocalePicker.vue';
import baseAppProvider from './src/BaseAppProvider.vue';
import baseAppToggleDarkMode from './src/BaseAppToggleDarkMode.vue';

export { useAppProviderContext } from './src/useAppContext';

export const BaseAppProvider = withInstall(baseAppProvider);
export const BaseAppLocalePicker = withInstall(baseAppLocalePicker);
export const BaseAppToggleDarkMode = withInstall(baseAppToggleDarkMode);
