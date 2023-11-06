import mitt from '/@/libs/utils/mitt';

const emitter = mitt();

const key = Symbol();

export function closeDynDialog() {
  emitter.emit(key, true);
}

export function listenerCloseDynDialog(callback: () => void, immediate = false) {
  emitter.on(key, callback as any);
  immediate && callback();
}

export function removeCloseDynDialog() {
  emitter.clear();
}
