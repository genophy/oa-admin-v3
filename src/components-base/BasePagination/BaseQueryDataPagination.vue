<template>
  <!--
    查询分页容器
    -->
  <div class="flex flex-col h-full b__query-data-pagination overflow-hidden">
    <!-- 搜索条件区域 -->
    <div v-if="$slots.search" class="flex-shrink-0">
      <!-- 若是手机模式 -->
      <div v-if="getMobileMode" class="flex mb-2 justify-end">
        <el-button @click="triggerSearch"> <BaseIcon icon="ion:refresh" class="mr-2" /> 刷新</el-button>
        <el-button type="primary" @click="showDrawer = true"> <BaseIcon icon="ion:filter" class="mr-2" /> 筛选</el-button>

        <el-drawer v-model="showDrawer" title="查询" :size="getDrawerWidth" direction="rtl">
          <template #header="{ titleId, titleClass }">
            <h4 :id="titleId" :class="titleClass" class="flex"><BaseIcon icon="ion:filter" class="mr-2" />筛选</h4>
          </template>
          <template #default>
            <slot name="search" :mobileMode="getMobileMode" :triggerSearch="triggerSearch"></slot>
          </template>
          <template #footer>
            <div class="grid grid-cols-2">
              <el-button type="default" size="large" @click="resetFormField">{{ resetText }}</el-button>
              <el-button type="primary" size="large" @click="triggerSearch">{{ searchText }}</el-button>
            </div>
          </template>
        </el-drawer>
      </div>
      <!-- 若是pc模式 -->
      <slot v-else name="search" :mobileMode="getMobileMode" :triggerSearch="triggerSearch"></slot>
    </div>
    <!-- 操作栏目 -->
    <div v-if="$slots.ops" class="flex-shrink-0">
      <slot name="ops" :mobileMode="getMobileMode"></slot>
    </div>

    <!-- 内容区域: 若是手机模式：无限加载 -->

    <div
      v-if="loaded"
      ref="refListContainer"
      v-loading="queryStatus === queryStatusEnum.querying"
      v-infinite-scroll="triggerQueryNext"
      :infinite-scroll-disabled="!infiniteMode || isLastPage"
      :infinite-scroll-immediate="true"
      :infinite-scroll-distance="80"
      class="flex-grow h-full b__query-data-container relative"
      style="overflow: auto"
    >
      <el-backtop target=".b__query-data-container" :bottom="80" />
      <template v-if="dataAble">
        <div class="pb-1">
          <slot name="default" :list="resList" :mobileMode="getMobileMode"> </slot>
        </div>
        <!-- 若是无限加载模式 -->
        <div v-if="infiniteMode" class="text-xs text-center py-12 text-gray-500">
          --{{ queryStatus === queryStatusEnum.querying ? '加载中' : queryStatus === queryStatusEnum.ready ? '下拉加载更多' : '加载完成' }} --
        </div>
      </template>
      <template v-else-if="$slots.fail">
        <slot name="fail" :queryStatus="queryStatus" :mobileMode="getMobileMode"></slot>
      </template>
      <div v-else>
        <el-empty :description="queryStatus === queryStatusEnum.empty ? '暂无数据' : '数据异常'" />
      </div>
    </div>

    <!-- 分页区域；无限加载模式 不显示 -->
    <div v-if="showPagination && !infiniteMode" class="flex flex-shrink-0 p-2 items-center justify-end">
      <div v-show="getMobileMode" class="text-xs">
        <span>{{ getPageIndex + 1 }}</span
        ><span class="ml-2 opacity-60">/{{ getPageTotal || 1 }}</span>
      </div>

      <ElPagination
        :page-size="getPageSize"
        :pager-count="5"
        :layout="getMobileMode ? 'prev, next' : pageLayout"
        :page-sizes="pageSizes"
        :total="getTotal"
        @size-change="handleChangeSize"
        @current-change="handleChangePage"
      />
    </div>
    <div v-if="$slots.footer" class="flex-shrink-0">
      <slot name="footer" :list="resList"></slot>
    </div>
    <!-- 对话框 -->
    <slot name="dialog" :width="getDrawerWidth"></slot>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { computed, onMounted, ref, unref, watch } from 'vue';
import BaseIcon from '../BaseIcon';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useQueryPagination } from '/@/libs/hooks/web/usePagination';
import { useAppStore } from '/@/libs/store/modules/app';
import { isUnDef } from '/@/libs/utils/is';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  pageSize: propTypes.number.def(10),
  pageSizes: {
    type: Array<number>,
    default: () => [10, 100, 200, 300, 400],
  },
  pageLayout: propTypes.string.def('total, sizes, prev, pager, next, jumper'),
  queryStatus: {
    type: String,
    default: queryStatusEnum.ready,
  },
  queryOrder: {
    type: Object,
    default: () => {},
  },
  resetText: propTypes.string.def('重置'),
  searchText: propTypes.string.def('确定'),
  infiniteAble: propTypes.bool.def(true),
  showPagination: propTypes.bool.def(true),
});
// async query({pageIndex,pageSize})
// return {list,status}
const emits = defineEmits(['query', 'search', 'reset', 'list']);

const appStore = useAppStore();

// 手机模式
const getMobileMode = computed(() => appStore.getMobileMode);
const getDrawerWidth = computed(() => appStore.getDrawerWidth);

// 无限加载模式
const infiniteMode = computed(() => unref(getMobileMode) && props.infiniteAble);

// 列表滚动区域
const refListContainer = ref();

//  组件缓存的查询条件
const queryParams = ref({});

const showDrawer = ref(false);

const paginationChangeFlag = ref('');

// 结果列表，对于小屏进行累加，大屏则更新
const resList: any = ref([]);

const { getPageIndex, getPageSize, getPageTotal, getTotal, isLastPage, setPageIndex, setPageSize, setTotal, joinParams, next } = useQueryPagination(props.pageSize);

// 列表是否可用
const dataAble = computed(() => [queryStatusEnum.ready, queryStatusEnum.querying, queryStatusEnum.finish].includes(props.queryStatus as queryStatusEnum));

/**
 *  处理返回的列表
 */
const dealResList = (list = []) => {
  // 若是无限加载模式，则追加结果
  if (unref(infiniteMode)) resList.value.push(...list);
  else resList.value = list;
  emits('list', unref(resList));
};

watch(
  () => getMobileMode.value,
  () => {
    triggerSearch();
  },
);

// 监听分页组件被动改变
watch(
  () => paginationChangeFlag.value,
  () => {
    if (!unref(getMobileMode)) emits('query', joinParams(unref(queryParams) || {}, props.queryOrder), dealResList);
  },
);

const handleChangeSize = (_pageSize) => {
  setPageSize(_pageSize);
  setPageIndex(0);
  paginationChangeFlag.value = [unref(getPageIndex), unref(getPageSize)].join(',');
};

const handleChangePage = (pageNum) => {
  const _pageIndex = pageNum - 1;
  setPageIndex(_pageIndex);
  paginationChangeFlag.value = [unref(getPageIndex), unref(getPageSize)].join(',');
};

// 触发重置表单
const resetFormField = () => emits('reset');

// 触发搜索
const triggerSearch = () => emits('search');

// 查询
const triggerQuery = () => emits('query', joinParams(unref(queryParams), props.queryOrder), dealResList);

// 执行搜索，缓存新的查询条件
const search = (_params = {}) => {
  showDrawer.value = false;
  queryParams.value = cloneDeep(_params);
  setPageIndex(0);
  if (refListContainer.value) refListContainer.value.scrollTop = 0;
  triggerRefresh();
};

// 刷新
// 若是无限加载模式，则刷新，就从第一页开始
const triggerRefresh = () => {
  if (unref(infiniteMode)) {
    setPageIndex(0);
    if (refListContainer.value) refListContainer.value.scrollTop = 0;
    resList.value.length = 0;
  }
  triggerQuery();
};

// 触发查询下一页
const triggerQueryNext = () => {
  if (unref(isLastPage)) return;
  next();
  triggerQuery();
};

// 设置总记录数
const setRecordTotal = (_total = 0, _current?: number | undefined) => {
  setTotal(_total);

  // 若当前页不是第一页，且 getTotal 不为 0 ，且 _current = 0 时，自动从最后一页重新查询
  if (unref(getPageIndex) > 0 && unref(getTotal) !== 0 && !isUnDef(_current) && _current === 0) {
    setPageIndex(unref(getPageTotal) - 1);
    triggerQuery();
    return queryStatusEnum.ready;
  }

  if (_total === 0) return queryStatusEnum.empty;
  // 若是最后一页
  if (isLastPage.value) return queryStatusEnum.finish;

  return queryStatusEnum.ready;
};

// 防止 infinite-scroll 报错
const loaded = ref(false);

/**
 * 组件加载
 */
onMounted(() => {
  loaded.value = true;
});

// 导出方法
defineExpose({
  triggerSearch,
  triggerRefresh,
  triggerQuery,
  search,
  setRecordTotal,
});
</script>

<style scoped lang="scss"></style>
