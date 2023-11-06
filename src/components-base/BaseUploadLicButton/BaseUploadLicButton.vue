<!--
  FileDesc  : BaseUploadLicButton
  path      : src/components-base/BaseUploadLicButton/BaseUploadLicButton.vue
  Author    : sq
  Version   :
  Usage     :
-->
<template>
  <div class="b__upload-lic-button">
    <div class="btn-upload" :class="{ disabled: isSubmitting }">
      <div class="btn-upload__text">{{ isSubmitting ? '上传中' : compLabelShow }}</div>
      <input v-if="!isSubmitting" ref="fileInput" class="btn-upload__input" type="file" accept=".lic" @change="handleFileChange" />
    </div>
    <div class="filename">
      <span>{{ compFileName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '/@/libs/utils/http/axios';
import { propTypes } from '/@/libs/utils/propTypes';
import { computed, ref } from 'vue';
import { useMessage } from '/@/libs/hooks/web/useMessage';
const { createMessage } = useMessage();
const props = defineProps({
  label: propTypes.string.def('请选择上传文件'), // 标签
  url: propTypes.string.def(''), // 上传的url
  fileName: propTypes.string.def(''), // 上传的文件名
  data: propTypes.object.def({}), // 表单数据
});
const emits = defineEmits(['update:modelValue', 'change', 'complete']);

let isSubmitting = false;
const compFileName: any = ref('');

const compLabelShow = computed(() => {
  return compFileName.value ? '点击更换文件' : props.label;
});

const handleFileChange = (e) => {
  const file = (e.target.files || [])[0];
  if (file) {
    const max = 500; // 最大为max兆
    if (file.size > max * 1024 * 1024) {
      createMessage.error(`文件大小不能超过${max}M`);
      return;
    }
    // 若设置了url表示可以直接上传
    if (props.url && props.fileName) {
      isSubmitting = true;
      const params = Object.assign({}, props.data);
      params[props.fileName] = file;
      const load = createMessage.loading('上传中');
      defHttp
        .postFormData({ url: props.url }, params as any)
        .then((res) => {
          let msg = res || '上传成功';
          createMessage.success(msg as any);
          emits('complete', true);
        })
        .catch((err) => {
          console.log(err);
          createMessage.warning('上传失败');
          emits('complete', false);
        })
        .finally(() => {
          load.close();
          isSubmitting = false;
        });
    } else {
      // 若未设置url。则直接将file $emit:input
      console.log(file, 9999);
      emits('update:modelValue', file);
      emits('change', file);
    }
    compFileName.value = file.name;
  } else {
    compFileName.value = '';
  }
};
</script>
<style scoped lang="scss">
/*
    01.显示与浮动 (display,float)
    02.定位(position,left,z-index)
    03.尺寸(width,height)
    04.边框及相关属性（margin,padding,border,outline）
    05.字体样式(font)
    06.背景（background）
    07.其它样式(opacity,cursors,transform,...)
*/
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
  font-size: 12px;
  line-height: 18px;
  color: #999;
  display: block;
  max-width: 100%;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
