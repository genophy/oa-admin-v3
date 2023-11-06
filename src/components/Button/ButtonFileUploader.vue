<!--
  FileDesc  : ButtonFileUploader 文件上传按钮
  path      : src/components/Button/ButtonFileUploader.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-button-file-uploader">
    <div class="btn-upload" :class="{ disabled: isSubmitting }">
      <div class="btn-upload__text">{{ isSubmitting ? `上传中(${uploadPercent}%)` : fileHex ? '更换文件' : '点击上传' }}</div>
      <input v-if="!isSubmitting" ref="fileInput" class="btn-upload__input" type="file" :accept="acceptType" @change="handleFileChange" />
    </div>
    <div>{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue';
import { FileStoreController } from '/@/api';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { FileUtils } from '/@/libs/utils/file/fileUtils';
import { propTypes } from '/@/libs/utils/propTypes';
const { createMessage } = useMessage();

defineProps({
  fileHex: propTypes.string.def(''),
  acceptType: propTypes.string.def('*'), // image/* file/*
});

const emits = defineEmits(['update:modelValue', 'change']);
let isSubmitting = ref(false);

const uploadPercent = ref(0);
const errorMessage = ref('');

// const hasFile = computed(() => props.fileHex);

/**
 * 文件改变
 * @param e
 */
const handleFileChange = async (e) => {
  const file = (e.target.files || [])[0];
  isSubmitting.value = true;
  uploadPercent.value = 0;
  errorMessage.value = '';
  const splitFileDataArr: any[] = await FileUtils.splitFileData(file);
  const _fileHex = splitFileDataArr[0]?.fileHex;

  //  若文件存在，则秒传
  const fileInfo = await FileStoreController.fileStoreFileInfo(_fileHex);
  if (fileInfo) {
    uploadPercent.value = 100;
    emits('update:modelValue', fileInfo.fileHex);
    emits('change', fileInfo.fileHex);
    createMessage.success('秒传成功');
    isSubmitting.value = false;
    return;
  }

  FileUtils.uploadSplitFileData(FileStoreController.fileStoreUploadBigFile, splitFileDataArr, {}, (percent) => {
    uploadPercent.value = percent;
  })
    .then((fileInfo) => {
      uploadPercent.value = 100;
      emits('update:modelValue', fileInfo.fileHex);
      emits('change', fileInfo.fileHex);
      createMessage.success('上传成功');
    })
    .catch((err) => {
      uploadPercent.value = 0;
      errorMessage.value = err.message || '上传失败';
      createMessage.error(unref(errorMessage));
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>

<style scoped lang="scss">
.btn-upload {
  position: relative;
  width: 80px;
  font-size: 12px;
  height: 30px;
  border-radius: 4px;
  user-select: none;
  overflow: hidden;

  &.disabled {
    background-color: #444;

    .btn-upload__text,
    .btn-upload__input {
      cursor: not-allowed;
    }
  }

  &:not(.disabled) {
    background-color: #444;

    .btn-upload__text,
    .btn-upload__input {
      cursor: pointer;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    pointer-events: none;
  }

  &__input {
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 0;
    opacity: 0;
  }
}

.filename {
  position: relative;
  font-size: 12px;
  line-height: 18px;
  height: 18px;
  color: #999;
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  .name {
    flex-grow: 1;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .progress {
    color: rgb(110, 184, 110);
    flex-shrink: 0;

    &.completed {
      color: rgb(47, 145, 47);
    }
  }
}
</style>
