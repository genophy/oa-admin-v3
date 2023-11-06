<!--
  FileDesc  : FormFieldFileUploader
  path      : src/components/FormField/FormFieldFileUploader.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="rounded-md flex shadow p-4 shadow-gray-400 v-form-field-file-uploader">
    <!-- 文件信息 -->
    <div v-if="fileInfo.fileName" class="mr-4 file-info">
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
    <div class="flex flex-shrink-0">
      <ButtonFileUploader :fileHex="fileInfo.fileHex" :acceptType="acceptType" @change="loadFileInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from 'vue';
import { FileStoreController } from '/@/api';
import { FileStoreUpdateDto } from '/@/api/dtos';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { fileSize } from '/@/libs/utils/commons';
import { downloadByData } from '/@/libs/utils/file/download';
import { propTypes } from '/@/libs/utils/propTypes';
import ButtonFileUploader from '../Button/ButtonFileUploader.vue';

const { createMessage } = useMessage();

const props = defineProps({
  modelValue: propTypes.string.def(''),
  acceptType: propTypes.string.def('*'), // image/* file/*
});

const emits = defineEmits(['update:modelValue']);

const fileInfo = ref(({} as FileStoreUpdateDto) || {});

watch(
  () => props.modelValue,
  (_f) => {
    if (_f) {
      loadFileInfo(_f);
    }
  },
  { immediate: true },
);
/**
 * 加载文件信息
 * @param fileHex
 */
const loadFileInfo = async (fileHex) => {
  const info = await FileStoreController.fileStoreFileInfo(fileHex);
  fileInfo.value = info;
  emits('update:modelValue', info.fileHex);
};

/**
 * 下载
 */
const handleDownload = () => {
  if (!fileInfo.value.fileHex) {
    createMessage.warning('暂无文件hash');
  }

  FileStoreController.fileStoreDownload(unref(fileInfo).fileHex || '', {}, 'message', { responseType: 'blob' }, { isReturnNativeResponse: true }).then((resp) => {
    const disposition = resp.headers['content-disposition'] || '';
    const fileName = (disposition.match(/.*?filename="(.*?)"/) || [])[1];
    downloadByData(resp.data, fileName);
  });
};
</script>

<style scoped lang="css"></style>
