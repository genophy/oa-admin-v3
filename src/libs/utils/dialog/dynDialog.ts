import { ElDialog } from 'element-plus';
import { App, h, inject, Plugin, ref, render } from 'vue';
import { listenerCloseDynDialog, removeCloseDynDialog } from '../../logics/mitt/dynDialogClose';
import { useAppStore } from '../../store/modules/app';
export const DynDialogSymbol = Symbol();
export class DynDialogResult {
  type: 'ok' | 'cancel' | 'close' | 'string' = 'ok';
  body?: any = undefined;
}
// 弹框属性
export type DialogPropsType = {
  title?: string;
  width?: string;
  destroyOnClose?: boolean;
  draggable?: boolean;
};

export class DynDialogService {
  private _app?: App = undefined;
  constructor(app: App) {
    this._app = app;
  }
  /**
   * 打开新的弹框
   * @param modal
   * @param props
   * @param dialogProps
   */
  public open(modal: any, props?: any, dialogProps: DialogPropsType = {}): Promise<DynDialogResult> {
    const { getMobileMode } = useAppStore();

    return new Promise((resolve, reject) => {
      if (!this._app) {
        reject('_app is undefined');
        return;
      }

      const container = document.createElement('div');
      document.getElementById('app')?.appendChild(container);

      // 这里需要合并props，传入到组件modal
      const showDialog = ref(true);

      const vm = h(modal, {
        ...props,
        onOk: (data?: any) => {
          showDialog.value = false;
          // 弹出框关闭时移除节点
          if (document.getElementById('app')?.contains(container)) document.getElementById('app')?.removeChild(container);
          resolve(this.ok(data));
        },
        onCancel: (data?: any) => {
          showDialog.value = false;
          // 弹出框关闭时移除节点
          if (document.getElementById('app')?.contains(container)) document.getElementById('app')?.removeChild(container);
          resolve(this.cancel(data));
        },
      });
      vm.appContext = this._app._context;

      const vm0 = h(
        ElDialog,
        {
          // value: showDialog.value,
          modelValue: showDialog.value,
          title: dialogProps.title || '',
          width: getMobileMode ? '50%' : dialogProps.width || '50%',
          'destroy-on-close': dialogProps.destroyOnClose || true,
          closeOnClickModal: false,
          draggable: dialogProps.draggable || true,
          'onUpdate:modelValue': (val) => {
            showDialog.value = val;
            // if (!val) {

            // }
          },
          onOpened: () => {
            listenerCloseDynDialog(() => {
              if (document.getElementById('app')?.contains(container)) document.getElementById('app')?.removeChild(container);
              resolve(this.closeThis());
            });
          },

          onClosed: () => {
            removeCloseDynDialog();
            // 弹出框关闭时移除节点
            if (document.getElementById('app')?.contains(container)) document.getElementById('app')?.removeChild(container);
            resolve(this.closeThis());
          },
        },
        {
          default: () => vm,
        },
      );

      // 这里很重要，关联app上下文
      vm0.appContext = this._app._context;
      render(vm0, container);
    });
  }

  // public close() {
  //   return new Promise((resolve) => {
  //     resolve(true);
  //   });
  // }

  public ok(data?: any): DynDialogResult {
    const result = new DynDialogResult();
    result.type = 'ok';
    result.body = data;
    return result;
  }

  public cancel(data?: any): DynDialogResult {
    const result = new DynDialogResult();
    result.type = 'cancel';
    result.body = data;
    return result;
  }
  public closeThis(): DynDialogResult {
    const result = new DynDialogResult();
    result.type = 'close';
    return result;
  }
}

export function useDynDialog(): DynDialogService {
  const DynModal = inject<DynDialogService>(DynDialogSymbol);
  if (!DynModal) {
    throw new Error('No DynDialog provided!');
  }

  return DynModal;
}

const plugin: Plugin = {
  install(app: App, _options?: { [key: string]: any }) {
    const DynModal = new DynDialogService(app);
    app.config.globalProperties.$DynModal = DynModal;
    app.provide(DynDialogSymbol, DynModal);

    // listenerCloseDynDialog(() => {
    //   debugger;
    //   DynModal.close();
    // });
  },
};

export default plugin;
