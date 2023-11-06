<template>
  <div class="ly-shadow b__image inline-flex relative" :class="{ round: round }" :style="{ width: sizePx, height: sizePx }">
    <div v-if="currentImage" class="h-full w-full">
      <el-popconfirm v-if="del" :title="`确定删除？`" @confirm="emits('del')">
        <template #reference>
          <BaseIcon icon="ion:close-circle" class="cursor-pointer text-lg -top-2 -right-2 text-red-500 z-10 icon-del absolute" />
        </template>
      </el-popconfirm>
      <el-image :src="currentImage" class="h-full w-full" :fit="fit" :lazy="lazy" :loading="loading" :preview-src-list="previewImageList" :initial-index="current">
        <template #error>
          <slot v-if="$slots.error" name="error"></slot>
          <div v-else :style="{ fontSize: sizePx, width: sizePx, height: sizePx, lineHeight: sizePx }" class="flex opacity-40 justify-center items-center">
            <BaseIcon icon="ion:image" class="transform scale-60" />
          </div>
        </template>
        <template #placeholder>
          <div v-loading="true" class="h-full"></div>
        </template>
      </el-image>
    </div>
    <div v-else class="h-full w-full">
      <slot v-if="$slots.error" name="error"></slot>
      <div v-else :style="{ fontSize: sizePx, width: sizePx, height: sizePx, lineHeight: sizePx }" class="flex opacity-40 justify-center items-center">
        <BaseIcon icon="ion:image" class="transform scale-60" />
      </div>
    </div>
    <slot></slot>
  </div>

  <!--  -->
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseIcon from '../BaseIcon';
import { prefixImgUrl } from '/@/libs/utils/commons';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  fit: propTypes.oneOf(['', 'contain', 'cover', 'fill', 'none', 'scale-down']).def('cover') as any,
  lazy: propTypes.bool.def(false), // 是否懒加载
  loading: propTypes.oneOf(['eager', 'lazy'] as any).def('lazy'),
  imgList: propTypes.array.def([]), // 图片列表
  current: propTypes.number.def(0), // 默认图片下标
  preview: propTypes.bool.def(false), // 是否预览
  prefix: propTypes.bool.def(true), // 补充前缀
  del: propTypes.bool.def(false), // 是否可以删除
  size: propTypes.number.def(40),
  round: propTypes.bool.def(false), // 是否圆形
});

// 当前图片
const currentImage = ref('');

// 预览图片
const previewImageList = ref([]);
const emits = defineEmits(['del']);
const sizePx = computed(() => `${props.size}px`);

watch(
  () => props.imgList,
  (v: any) => {
    if (v?.length > 0) {
      currentImage.value = props.prefix ? prefixImgUrl(v[props.current], props.size * 3) : v[props.current];

      if (props.preview) previewImageList.value = v.map((url) => (props.prefix ? prefixImgUrl(url) : url));
    } else {
      currentImage.value = '';
      previewImageList.value = [];
    }
  },
  { immediate: true, deep: true },
);
</script>

<style scoped lang="scss">
.b__image {
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--bg);

  &.round {
    border-radius: 50%;
  }

  &:hover {
    .icon-del {
      opacity: 0.8;
    }
  }

  &:not(:hover) {
    .icon-del {
      opacity: 1;
    }
  }
}
</style>
