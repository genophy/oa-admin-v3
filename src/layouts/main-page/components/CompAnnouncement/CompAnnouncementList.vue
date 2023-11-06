<!--
  FileDesc  : CompAnnouncementList
  path      : src/layouts/main-page/components/CompAnnouncement/CompAnnouncementList.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full min-h-60 v__announcement-list"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryCompAnnouncementList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="80" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" @keypress.enter="triggerSearch">
        <el-form-item label="标题" prop="title">
          <el-input v-model="searchField.title" placeholder="标题" clearable />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="searchField.content" placeholder="内容" clearable />
        </el-form-item>
        <el-form-item v-if="!mobileMode">
          <el-button type="primary" :loading="queryStatus === queryStatusEnum.querying" @click="triggerSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <BaseCard v-for="item in list" :key="item.id" class="m-4 ly-btn select-none relative" @click="handleViewDetail(item)">
        <template #header>
          <div class="flex justify-between items-end">
            <span class="font-bold text-lg">{{ item.title || '-' }}</span>
            <span class="text-xs text-gray-400">{{ toDateStr(item.createTime) || '-' }}</span>
          </div>
        </template>
        <div class="mt-2 text-xs truncate">
          {{ item.content }}
        </div>
        <span v-show="!~allReadIds.indexOf(item.id)" class="un-read"></span>
      </BaseCard>
    </template>
  </BaseQueryDataPagination>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { computed, getCurrentInstance, onMounted, reactive, Ref, ref, unref } from 'vue';
import CompAnnouncementDetail from './CompAnnouncementDetail.vue';
import { AnnouncementController } from '/@/api';
import BaseCard from '/@/components-base/BaseCard.vue';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { toDateStr } from '/@/libs/utils/dateUtil';
import { assignObj } from '/@/libs/utils/langUtil';

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

const remoteFullData = useRemoteFullDataStore();

const allReadIds = computed(() => remoteFullData.getAnnouncementIdsRead);

// 搜索表单Ref （重置表单数据用）
const refSearch = ref<FormInstance>();
// 基础Query分页Ref
const refPagination = ref<InstanceType<typeof BaseQueryDataPagination>>();
// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);

// 查询条件
const searchField = reactive({
  title: '',
  content: '',
});
/**
 * 查询排序
 */
const queryOrder = {
  createTime: 'DESC',
};

/**
 * 查询公告列表
 */
const queryCompAnnouncementList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await AnnouncementController.announcementList(params, 'message');
    callback(list);
    queryStatus.value = refPagination.value ? refPagination.value.setRecordTotal(total) : queryStatusEnum.ready;
  } catch (error) {
    callback();
    if (refPagination.value) refPagination.value.setRecordTotal(0);
    queryStatus.value = queryStatusEnum.fail;
  }
};

/**
 * 查看详情
 */
const handleViewDetail = (item) => {
  dynDialog.open(CompAnnouncementDetail, { info: item }, { title: '公告详情' });
};

onMounted(() => {
  refPagination.value?.triggerSearch();
});
</script>

<style scoped lang="scss">
.un-read {
  position: absolute;
  top: 0;
  right: 0;

  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: var(--el-color-danger);
    margin: 4px;
  }
}
</style>
