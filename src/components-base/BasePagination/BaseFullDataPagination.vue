<template>
  <!-- 
    // 已知所有数据后进行分页
    // ------------------------------------------------------------------------
    用法示例：
    <BaseFullDataPagination :list="currentList">
      <template #default="{ list }">
        <div class="max-h-60 grid gap-0.5 grid-cols-5 overflow-auto lg:grid-cols-10">
          <div v-for="item in list" :key="item">
            <el-button @click="hasSelectIcon(item)">
              <BaseIcon :icon="item || 'ion:create-outline'" />
            </el-button>
          </div>
        </div>
      </template>
    </BaseFullDataPagination>
   -->
  <div class="flex flex-col b__full-data-pagination">
    <div class="flex-grow">
      <slot :list="getPaginationList"></slot>
    </div>

    <div class="flex flex-shrink-0 p-2 items-center justify-end">
      <div v-show="mode === 'min'" class="text-xs">
        <span>{{ pageIndex + 1 }}</span
        ><span class="ml-2 opacity-60">/{{ getTotalPage || 1 }}</span>
      </div>
      <el-pagination :page-size="pageSize" :pager-count="5" :layout="mode === 'min' ? 'prev, next' : 'total, prev, pager, next'" :total="list.length" @current-change="handleChangePage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePagination } from '/@/libs/hooks/web/usePagination';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  list: propTypes.array.def(() => []),
  pageSize: propTypes.number.def(50),
  mode: propTypes.oneOf(['default', 'min']).def('min'),
});

// const emits = defineEmits(['change']);

const currentList: any = ref([]);
watch(
  () => props.list,
  (v) => {
    currentList.value = v || [];
    // emits('change', unref(getPaginationList));
  },
  { immediate: true, deep: true },
);

const { getPaginationList, getTotalPage, setCurrentPage } = usePagination(currentList, props.pageSize);

let pageIndex = ref(0);

const handleChangePage = (num) => {
  pageIndex.value = num + 1;
  setCurrentPage(pageIndex.value);
};
</script>

<style scoped lang="scss"></style>
