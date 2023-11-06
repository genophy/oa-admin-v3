import type { ErrorMessageMode } from '/#/axios';
import { useI18n } from '/@/libs/hooks/web/useI18n';
import { useMessage } from '/@/libs/hooks/web/useMessage';
// import router from '/@/libs/router';
// import { PageEnum } from '/@/libs/enums/pageEnum';
import { SessionTimeoutProcessingEnum } from '/@/libs/enums/appEnum';
import projectSetting from '/@/libs/settings/projectSetting';
import { useUserStoreWithOut } from '/@/libs/store/modules/user';

const { createMessage, createAlert } = useMessage();
const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(status: number, message: string, errorMessageMode: ErrorMessageMode = 'message'): void {
  const { t } = useI18n();
  const userStore = useUserStoreWithOut();
  let errMessage = '';
  switch (status) {
    case 400:
      errMessage = `${message}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      userStore.setToken(undefined);
      errMessage = message || t('sys.errMsg401');
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setSessionTimeout(true);
      } else {
        userStore.logout(true);
      }
      break;
    case 403:
      errMessage = t('sys.errMsg403');
      break;
    // 404请求不存在
    case 404:
      errMessage = t('sys.errMsg404');
      break;
    case 405:
      errMessage = t('sys.errMsg405');
      break;
    case 408:
      errMessage = t('sys.errMsg408');
      break;
    case 500:
      errMessage = t('sys.errMsg500');
      break;
    case 501:
      errMessage = t('sys.errMsg501');
      break;
    case 502:
      errMessage = t('sys.errMsg502');
      break;
    case 503:
      errMessage = t('sys.errMsg503');
      break;
    case 504:
      errMessage = t('sys.errMsg504');
      break;
    case 505:
      errMessage = t('sys.errMsg505');
      break;
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createAlert(t('sys.errorTip'), errMessage, null, { type: 'error' });
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage);
      // error({ content: errMessage, key: `global_error_message_status_${status}` });
    }
  }
}
