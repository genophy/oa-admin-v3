import mitt from '/@/libs/utils/mitt';

const emitter = mitt();

const key = Symbol();

export function cancelPending() {
  emitter.emit(key, true);
}

export function listenerCancelPending(callback: () => void, immediate = false) {
  emitter.on(key, callback as any);
  immediate && callback();
}

export function cancelPendingChange() {
  emitter.clear();
}
