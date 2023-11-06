import { ElLoading, ElMessage, ElMessageBox, ElNotification, MessageBoxData, NotificationProps } from 'element-plus';

// 消息弹框 -------------------------------------------------------------------
export interface LoadingOptions {
  target?: object | string;
  lock?: boolean;
  spinner?: string;
  background: string;
  fullscreen: boolean;
}

const createMessage = {
  message(message: string) {
    ElMessage({
      message,
    });
  },
  success(message: string) {
    ElMessage({
      message,
      type: 'success',
    });
  },
  warning(message: string) {
    ElMessage({
      message,
      type: 'warning',
    });
  },
  error(message: string) {
    ElMessage({
      message,
      type: 'error',
    });
  },

  // 加载 ---------------------------------------------
  loading(text = '加载中', duration = 30000, options?: LoadingOptions | any) {
    const loading = ElLoading.service(
      Object.assign(
        {
          fullscreen: true,
          lock: true,
          text: text,
          background: 'rgba(255,255,255,0.2)',
        },
        options,
      ),
    );

    setTimeout(() => {
      loading.close();
    }, duration);

    return loading;
  },
};

// 提醒 -------------------------------------------------------------------

const createNotification = {
  success(title: string, message: string, options?: NotificationProps) {
    ElNotification(Object.assign({ title, message, type: 'success' }, options));
  },
  warning(title: string, message: string, options?: NotificationProps) {
    ElNotification(Object.assign({ title, message, type: 'warning' }, options));
  },
  info(title: string, message: string, options?: NotificationProps) {
    ElNotification(Object.assign({ title, message, type: 'info' }, options));
  },
  error(title: string, message: string, options?: NotificationProps) {
    ElNotification(Object.assign({ title, message, type: 'error' }, options));
  },
};

// 交互性弹框
export interface ConfirmModalOptions {
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

/**
 * 确认弹框
 * @param title
 * @param message
 * @param onOk
 * @param opt
 * @returns
 */
const createConfirm = (title: string, message: string, onOk?: () => Promise<any>, opt?: ConfirmModalOptions): Promise<MessageBoxData | any> => {
  return ElMessageBox({
    title,
    message,
    showCancelButton: true,
    confirmButtonText: opt?.confirmButtonText || '确定',
    cancelButtonText: opt?.cancelButtonText || '取消',
    closeOnClickModal: false,
    draggable: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = '加载中...';
        if (typeof onOk === 'function') {
          onOk()
            .then(() => {
              done();
            })
            .finally(() => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = opt?.confirmButtonText || '确定';
            });
        } else {
          done();
          instance.confirmButtonLoading = false;
          instance.confirmButtonText = opt?.confirmButtonText || '确定';
        }
      } else {
        done();
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = opt?.confirmButtonText || '确定';
      }
    },
  }).catch((_err) => {
    return 'cancel';
  });
};

/**
 * 消息弹框
 * @param title
 * @param message
 * @param callback
 * @param opt
 * @returns
 */
const createAlert = (title: string, message: string, callback: Nullable<Fn>, opt?: ConfirmModalOptions): Promise<MessageBoxData> => {
  return ElMessageBox.alert(message, title, {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: opt?.confirmButtonText || '确定',
    draggable: true,
    closeOnClickModal: false,
    callback: () => {
      if (callback) callback();
    },
    ...opt,
  });
};

/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage,
    createNotification,
    createConfirm,
    createAlert,
  };
}
