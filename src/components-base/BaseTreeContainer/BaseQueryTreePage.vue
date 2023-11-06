<template>
  <!--  -->
  <div v-resize="handleOnResize" v-loading="queryStatus === queryStatusEnum.querying" class="flex flex-col h-full v__menu-mgt overflow-hidden">
    <div v-if="$slots.search" class="flex-shrink-0">
      <slot name="search" :dual="dual"></slot>
    </div>
    <div v-if="dataAble" class="flex-grow overflow-hidden" :class="{ 'grid grid-cols-2': dual }">
      <div class="flex flex-col flex-grow overflow-hidden">
        <slot :dual="dual"></slot>
      </div>

      <!-- 双列: 编辑 -->
      <div v-if="dual && (queryStatus === queryStatusEnum.querying || queryStatus === queryStatusEnum.finish)" class="flex flex-col flex-shrink-0 pl-4 overflow-hidden">
        <slot name="edit" :dual="dual"> </slot>
      </div>
      <!-- 单列：编辑 -->
      <template v-else>
        <slot name="drawerEdit" :dual="dual" :width="getDrawerWidth"> </slot>
      </template>
    </div>
    <!-- 失败后,设置默认显示内容 -->
    <div v-else-if="$slots.fail" class="flex-grow">
      <slot name="fail" :dual="dual"></slot>
    </div>
    <!-- 对话框 -->
    <slot name="dialog" :width="getDrawerWidth"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useAppStore } from '/@/libs/store/modules/app';

const props = defineProps({
  // 查询状态（界面按钮使用）
  queryStatus: {
    type: String,
    default: queryStatusEnum.ready,
  },
});

const emits = defineEmits(['dualChange']);
// 列表是否可用
const dataAble = computed(() => [queryStatusEnum.ready, queryStatusEnum.querying, queryStatusEnum.finish].includes(props.queryStatus as queryStatusEnum));

const appStore = useAppStore();

const getDrawerWidth = computed(() => appStore.getDrawerWidth);

// 双列显示
const dual = ref(!appStore.getMobileMode);

const handleOnResize = ({ width }) => {
  dual.value = width > 800;
};

watch(
  () => dual.value,
  (v) => {
    emits('dualChange', v);
  },
  { immediate: true },
);
</script>

<style scoped lang="scss"></style>
