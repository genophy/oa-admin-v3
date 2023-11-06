<!--
  FileDesc  : BaseFileDownloadCard 文件下载card
  path      : src/components-base/BaseFile/BaseFileDownloadCard.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div v-if="fileInfo && fileInfo.fileName" class="rounded-md flex shadow p-4 shadow-gray-400 items-center">
    <div class="flex-grow break-all">
      <div :title="fileInfo.fileName" class="font-bold text-sm overflow-hidden">{{ fileInfo.fileName }} </div>
      <div class="flex mt-2 items-center">
        <div class="text-xs text-gray-400">{{ fileSize(fileInfo.fileSize) || '' }} </div>
        <div class="ml-2 ly-btn" title="下载" @click="handleDownload">
          <BaseIcon icon="ion:download-outline" :size="16" />
        </div>
      </div>
    </div>
  </div>
  <!-- <div v-else class="flex text-xs p-4 text-gray-400 justify-center"> 暂无文件 </div> -->
</template>

<script setup lang="ts">
import { ref, unref, watch } from 'vue';
import BaseIcon from '../BaseIcon';
import { FileStoreController } from '/@/api';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { fileSize } from '/@/libs/utils/commons';
import { downloadByData } from '/@/libs/utils/file/download';
import { propTypes } from '/@/libs/utils/propTypes';

const { createMessage } = useMessage();

const props = defineProps({
  fileHex: propTypes.string.def(''),
  name: propTypes.string.def('下载'),
  direct: propTypes.oneOf(['right', 'bottom']).def('bottom'),
});

const fileInfo: any = ref({});

const loadFileInfo = async (fileHex) => {
  const info = await FileStoreController.fileStoreFileInfo(fileHex);
  fileInfo.value = info;
};

watch(
  () => unref(props.fileHex),
  (v) => {
    if (v) {
      loadFileInfo(v);
    } else {
      fileInfo.value = {};
    }
  },
  { immediate: true },
);

/**
 * 下载
 */
const handleDownload = () => {
  if (!props.fileHex) {
    createMessage.warning('请设置文件hash');
  }

  FileStoreController.fileStoreDownload(props.fileHex, {}, 'message', { responseType: 'blob' }, { isReturnNativeResponse: true }).then((resp) => {
    const disposition = resp.headers['content-disposition'] || '';
    const fileName = (disposition.match(/.*?filename="(.*?)"/) || [])[1];
    downloadByData(resp.data, fileName);
  });
};
</script>

<style scoped lang="scss"></style>
