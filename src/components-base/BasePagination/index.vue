<template>
  <!--  -->
  <div class="flex flex-col b__pagination">
    <div class="flex-grow">
      <slot></slot>
    </div>

    <div v-if="mode === 'default'" class="flex-shrink-0">
      <el-pagination
        hide-on-single-page
        :page-size="pageSize"
        :pager-count="5"
        layout="prev, pager, next"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleChangeSize"
        @current-change="handleChangePageNow"
      />
    </div>
    <div v-else-if="mode === 'min'" class="flex flex-shrink-0 p-2 items-center justify-end">
      <div class="mx-2"
        >{{ pageIndex + 1 }}/ <span>{{ getTotalPage }}</span>
      </div>
      <el-button size="small" :disabled="isFirstPage" circle @click="handlePrevPage">
        <BaseIcon icon="ion-caret-back-outline" />
      </el-button>
      <el-button size="small" :disabled="isLastPage" circle @click="handleNextPage">
        <BaseIcon icon="ion-caret-forward" />
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue';
import { propTypes } from '/@/libs/utils/propTypes';
import BaseIcon from '../BaseIcon';

const props = defineProps({
  pageIndex: propTypes.number.def(0),
  pageSize: propTypes.number.def(0),
  total: propTypes.number.def(0),
  layout: propTypes.string.def('prev, pager, next,sizes'),
  pageSizes: {
    type: Array<number>,
    default: () => [10, 50, 100, 500],
  },
  mode: propTypes.oneOf(['default', 'min']).def('min'),
});

const emits = defineEmits(['size-change', 'current-change', 'prev', 'next']);

const getTotalPage = computed(() => Math.ceil(props.total / props.pageSize));

const isFirstPage = computed(() => {
  return props.pageIndex <= 0;
});

const isLastPage = computed(() => {
  return unref(getTotalPage) <= props.pageIndex + 1;
});

const handleChangeSize = (pageSize) => {
  emits('size-change', pageSize);
};

const handleChangePageNow = (pageIndex) => {
  emits('current-change', pageIndex);
};

const handlePrevPage = () => {
  emits('prev', Math.max(props.pageIndex, 1));
};

const handleNextPage = () => {
  emits('next', Math.min(props.pageIndex + 1, unref(getTotalPage)));
};
</script>

<style scoped lang="scss"></style>
