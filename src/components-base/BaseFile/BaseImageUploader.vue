<!--
  FileDesc  : BaseImageUploader
  path      : src/components-base/BaseFile/BaseImageUploader.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-base-image-uploader">
    <div v-for="imageHex in imageHexes" :key="imageHex" class="img-item box-item relative">
      <!-- <i v-if="editAble && !disabled" class="icon-del ixfont ix-close" @click="handleDel(imgId)"></i> -->
      <BaseIcon v-if="editAble && !disabled" icon="ion:close-circle" class="icon-del" :size="24" @click="handleDel(imageHex)" />
      <el-image class="img" :src="convertImage(imageHex, 120)" fit="cover" :preview-src-list="preview ? [convertImage(imageHex)] : []" />
    </div>
    <!-- 新增按钮 -->
    <div v-if="!limit || (!disabled && imageHexes.length < limit)" class="box-item relative">
      <div v-if="uploading" class="flex h-full w-full justify-center items-center">
        <el-button v-if="removeAllHttpPending" plain class="transform bottom-0 left-1/2 z-10 -translate-x-1/2 absolute" size="small" @click="cancelPending()">取消上传</el-button>
        <el-progress :width="90" type="dashboard" :percentage="uploadPercentage" :status="uploadPercentage === 1000 ? 'success' : ''" />
      </div>

      <div v-else class="h-full w-full btn-upload relative">
        <BaseIcon icon="ion:add-outline" class="icon-add" :size="48" />
        <input v-for="cache in fileCache" :key="cache" ref="fileInput" class="btn-upload__input" type="file" :multiple="limit > 1" accept="image/*" @change="handleAddFile" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, remove } from 'lodash-es';
import { onUnmounted, ref, unref, watch } from 'vue';
import BaseIcon from '../BaseIcon';
import { FileStoreController } from '/@/api';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { cancelPending } from '/@/libs/logics/mitt/pendingClean';
import projectSetting from '/@/libs/settings/projectSetting';
import { prefixImgUrl, randomStrId } from '/@/libs/utils/commons';
import { FileUtils } from '/@/libs/utils/file/fileUtils';
import { propTypes } from '/@/libs/utils/propTypes';

const { createMessage } = useMessage();
const { removeAllHttpPending } = projectSetting;

const props = defineProps({
  modelValue: propTypes.array.def([]), // 多个图片 hex
  strValue: propTypes.string.def(''), // 多个图片 ',' 分割
  single: propTypes.string.def(''), // 单个图片hex
  width: propTypes.number.def(0), // 每张图片的宽度 0 表示不限制
  height: propTypes.number.def(0), // 每张图片的宽度 0 表示不限制
  limit: propTypes.number.def(1), //  允许有多少图片 0 表示不限制
  size: propTypes.number.def(20), // 图片大小 20M  0 表示不限制
  preview: propTypes.bool.def(false), // 是否预览
  prefix: propTypes.bool.def(true), // 补充前缀
  editAble: propTypes.bool.def(true), // 是否可编辑
  disabled: propTypes.bool.def(false), // 是否禁用
});

const emits = defineEmits(['change', 'update:modelValue', 'update:strValue', 'update:single']);
// 图片 md5
const imageHexes: any = ref([]);

// 是否正在上传
const uploading = ref(false);

const uploadPercentage = ref(0);

const fileCache = ref([randomStrId()]);

watch(
  () => [props.single, props.modelValue, props.strValue],
  () => {
    if (props.single) {
      imageHexes.value = [props.single];
    } else if (props.strValue) {
      imageHexes.value = props.strValue.split(',');
    } else {
      imageHexes.value = cloneDeep(props.modelValue) || [];
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

/**
 * 转换图片
 * @param url
 * @param size
 */
const convertImage = (url, size = 0) => {
  if (props.prefix) return prefixImgUrl(url, size);
  return url;
};

/**
 * 新增图片
 */
const handleAddFile = async (e) => {
  const files = e.currentTarget.files || [];
  const left = props.limit - unref(imageHexes).length;
  if (left > 0) {
    for (let i = 0; i < Math.min(files.length, left); i++) {
      if (props.size && files[i].size / 1024 / 1024 > props.size) {
        createMessage.warning(`图片大小不得超过${props.size}MB`);
        return;
      }
      const imageHex = await uploadImage(files[i]);
      if (imageHex) imageHexes.value.push(imageHex);
    }
    emitsAll();
  }
};

/**
 * 删除图片
 * @param imageHex
 */
const handleDel = (imageHex) => {
  remove(unref(imageHexes), (val) => val === imageHex);
  emitsAll();
};

/**
 * 上传图片
 */
const uploadImage = async (file) => {
  uploading.value = true;
  uploadPercentage.value = 0;

  const fileHex = await FileUtils.calcFileMd5(file, 0);
  //  若文件存在，则秒传
  // const fileInfo = await FileStoreController.fileStoreFileInfo(fileHex);
  // if (fileInfo) {
  //   uploadPercentage.value = 100;
  //   uploading.value = false;
  //   // createMessage.success('秒传成功');
  //   return fileHex;
  // }

  return FileStoreController.fileStoreUploadImage({ file }, ({ loaded, total }) => {
    uploadPercentage.value = Math.floor((loaded / total) * 100);
  })
    .then(() => {
      uploadPercentage.value = 100;
      return fileHex;
    })
    .catch(() => {
      uploadPercentage.value = 0;
    })
    .finally(() => {
      uploading.value = false;
    });
};

/**
 * 设置图片md5
 */

const setImgHexes = (_setImgHexes, emit = false) => {
  imageHexes.value = cloneDeep(_setImgHexes) || [];
  if (emit) emitsAll();
};

/**
 * 提交所有
 */
const emitsAll = () => {
  emits('change', unref(imageHexes));
  emits('update:modelValue', unref(imageHexes));
  emits('update:strValue', unref(imageHexes).join(','));
  emits('update:single', unref(imageHexes)[0] || '');
};

/**
 * 组件销毁
 */
onUnmounted(() => {
  cancelPending();
});

/**
 * 导出
 */
defineExpose({
  setImgHexes,
});
</script>

<style scoped lang="scss">
.box-item {
  position: relative;
  margin-right: 16px;
  margin-bottom: 16px;
  width: 96px;
  height: 96px;
}

.v-base-image-uploader {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 0;

  .img-item {
    position: relative;
    border-radius: 4px;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .btn-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-right: 8px;
    margin-bottom: 8px;
    color: #409eff;
    border: 1px dashed var(--el-border-color);
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    user-select: none;

    &:hover {
      opacity: 0.8;
    }

    .icon-add {
      font-size: 32px;
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
      cursor: pointer;
    }
  }
}

.icon-del {
  position: absolute;
  z-index: 1;
  right: -12px;
  top: -12px;
  font-size: 16px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #ff3d00;
  background: rgba(255, 255, 255, 0.64);
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 8px 1px rgba(0, 0, 0, 0.12);

  &:hover {
    opacity: 0.8;
  }
}
</style>
