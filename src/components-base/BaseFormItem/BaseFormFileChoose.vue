<!--
  FileDesc  : BaseFormFileChoose
  path      : src/components-base/BaseFormItem/BaseFormFileChoose.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="px-2 b__form-file-choose">
    <!-- 当前文件列表 -->
    <div v-for="(fItem, idx) in files" :key="fItem.name" class="flex items-center">
      <div class="flex-shrink-0">
        <div class="text-sm">{{ fItem.name }}</div>
        <div class="text-xs text-gray-400">{{ splitNum(Math.ceil((fItem.size || 0) / 1000)) }}kb</div>
      </div>
      <div class="cursor-pointer text-base ml-6 text-red-500">
        <BaseIcon icon="ion:close-outline" @click="handleDel(idx)" />
      </div>
    </div>
    <!-- 新增按钮 -->
    <div v-if="!limit || files.length < limit" class="border rounded cursor-pointer flex flex-col h-12 text-blue-400 w-20 relative items-center justify-center active:opacity-80">
      <BaseIcon icon="ion-add" class="text-xl" />
      <span class="text-xs">选择文件</span>
      <input v-for="cache in fileCache" :key="cache" ref="fileInput" class="cursor-pointer opacity-0 z-10 absolute" type="file" :accept="accept" @change="handleAddFile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { onMounted, ref, unref } from 'vue';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { randomStrId, splitNum } from '/@/libs/utils/commons';
import { propTypes } from '/@/libs/utils/propTypes';
import BaseIcon from '../BaseIcon';

const { createMessage } = useMessage();

const props = defineProps({
  single: propTypes.any, // 单个文件
  modelValue: propTypes.array.def([]), // 文件的ids
  limit: propTypes.number.def(0), //  允许有多少文件 0 表示不限制
  accept: propTypes.string.def('*'), // 接收类型
  size: propTypes.number.def(1000), // 文件大小
});

const emits = defineEmits(['change', 'update:modelValue', 'update:single']);

const fileCache = ref([randomStrId()]);

// 文件
const files: any = ref([]);

/**
 * 更换文件
 */
const handleAddFile = async (e) => {
  const file = (e.currentTarget.files || [])[0];
  fileCache.value = [randomStrId()];
  if (file) {
    if (file.size / 1024 / 1024 > props.size) {
      createMessage.warning(`文件大小不得超过${props.size}MB`);
      return;
    }

    files.value.push(file);
    emits('change', unref(files));
    emits('update:modelValue', unref(files));
    emits('update:single', unref(files)[0]);
  }
};
/**
 * 删除文件
 * @param imgId
 */
const handleDel = (idx) => {
  files.value.splice(idx, 1);
  emits('change', unref(files));
  emits('update:modelValue', unref(files));
  emits('update:single', unref(files)[0]);
};

/**
 * 设置文件
 */

const setFiles = (_files) => {
  files.value = cloneDeep(_files) || [];
};

/**
 * 组件加载
 */
onMounted(() => {
  if (props.single) {
    files.value = [props.single];
  } else {
    files.value = cloneDeep(props.modelValue) || [];
  }
});

/**
 * 导出
 */
defineExpose({
  setFiles,
});
</script>

<style scoped lang="scss"></style>
