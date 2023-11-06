<!--
  FileDesc  : BaseVideoUploader
  path      : src/components-base/BaseFile/BaseVideoUploader.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="w-full v-base-video-uploader">
    <div class="btn-upload" :class="{ disabled: isSubmitting }">
      <div class="btn-upload__text">{{ isSubmitting ? '上传中' : compLabelShow }}</div>
      <input v-if="!isSubmitting" ref="fileInput" class="btn-upload__input" type="file" :accept="acceptType" @change="handleFileChange" />
    </div>
    <div v-if="!errorMessage" class="filename">
      <span class="name">{{ fileName }}</span>
      <span v-if="isSubmitting || uploadPercent !== 0" class="ml-4 progress" :class="{ completed: uploadPercent === 100 }">{{ uploadPercent === 100 ? '上传完成' : `${uploadPercent}%` }}</span>
    </div>
    <div class="err-msg">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { FileStoreController } from '/@/api';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { FileUtils } from '/@/libs/utils/file/fileUtils';
import { propTypes } from '/@/libs/utils/propTypes';
const { createMessage } = useMessage();

const props = defineProps({
  modelValue: propTypes.oneOfType([String]).def(''),
  label: propTypes.string.def('请选择上传文件'), // 标签
  url: propTypes.string.def(''), // 上传的url
  acceptType: propTypes.string.def('video/*'), // image/* video/*
});

const emits = defineEmits(['update:modelValue']);

let isSubmitting = ref(false);
const fileName = ref('');
const uploadPercent = ref(0);
const errorMessage = ref('');

const compLabelShow = computed(() => {
  return fileName.value ? '点击更换文件' : props.label;
});

/**
 * 文件改变
 * @param e
 */
const handleFileChange = async (e) => {
  const file = (e.target.files || [])[0];
  isSubmitting.value = true;
  fileName.value = file.name;
  uploadPercent.value = 0;
  errorMessage.value = '';
  const splitFileDataArr: any[] = await FileUtils.splitFileData(file);
  const fileHex = splitFileDataArr[0]?.fileHex;

  //  若文件存在，则秒传
  const fileInfo = await FileStoreController.fileStoreFileInfo(fileHex);
  if (fileInfo) {
    uploadPercent.value = 100;
    emits('update:modelValue', fileHex);
    createMessage.success('秒传成功');
    isSubmitting.value = false;
    return;
  }

  FileUtils.uploadSplitFileData(FileStoreController.fileStoreUploadBigFile, splitFileDataArr, {}, (percent) => {
    // console.log('-----------> ', percent);
    uploadPercent.value = percent;
  })
    .then((fileInfo) => {
      uploadPercent.value = 100;
      emits('update:modelValue', fileInfo);
      createMessage.success('上传成功');
    })
    .catch((err) => {
      fileName.value = '';
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
  width: 100%;
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
