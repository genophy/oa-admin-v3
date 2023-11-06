<!--
  FileDesc  : announcement 公告
  path      : src/views/pages/system/announcement.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v__announcement"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryAnnouncementList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="80" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" @keypress.enter="triggerSearch">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchField.name" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item v-if="!mobileMode">
          <el-button type="primary" :loading="queryStatus === queryStatusEnum.querying" @click="triggerSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作区域 ------------------------------------------------------------- -->

    <template #ops>
      <div class="flex px-4 pb-2 items-center justify-end">
        <el-button text type="success" @click="handleAddAnnouncement">
          <BaseIcon icon="ion-add-outline" />
          新增</el-button
        >
      </div>
    </template>

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <div class="grid p-4 gap-2 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        <template v-for="item in list" :key="item.id">
          <BaseCard shadow="hover" class="relative">
            <el-descriptions :title="item.title" :column="2" size="small" direction="horizontal">
              <template #title>
                <div class="flex h-6 items-center">
                  <span class="font-extrabold text-lg">{{ item.title }}</span>
                </div>
              </template>
              <el-descriptions-item label="内容摘要" :span="2">
                <div class="line-clamp-2">
                  {{ item.content || '-' }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="最近更新时间" :span="2">{{ toDateStr(item.updateTime) || '-' }}</el-descriptions-item>
              <el-descriptions-item label="创建日期" :span="2">{{ toDateStr(item.createTime) || '-' }}</el-descriptions-item>
            </el-descriptions>
            <template #footer>
              <div class="flex mt-2 justify-end">
                <div>
                  <el-popconfirm title="确定删除？" @confirm="handleDelAnnouncement(item)">
                    <template #reference>
                      <el-button type="danger" size="small" class="mr-2"> <BaseIcon icon="ion:trash" /> 删除</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button type="primary" size="small" @click="handleEditAnnouncement(item)"><BaseIcon icon="ion:create-outline" />编辑</el-button>
                </div>
              </div>
            </template>
          </BaseCard>
        </template>
      </div>
    </template>
  </BaseQueryDataPagination>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { getCurrentInstance, onMounted, reactive, Ref, ref, unref } from 'vue';
import BaseCard from '/@/components-base/BaseCard.vue';
import CompAnnouncementEditor from './components/CompAnnouncementEditor.vue';
import { AnnouncementController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { toDateStr } from '/@/libs/utils/dateUtil';
import { assignObj } from '/@/libs/utils/langUtil';

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

const { createNotification } = useMessage();

// 搜索表单Ref （重置表单数据用）
const refSearch = ref<FormInstance>();
// 基础Query分页Ref
const refPagination = ref<InstanceType<typeof BaseQueryDataPagination>>();
// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);

// 查询条件
const searchField = reactive({
  name: '',
});
/**
 * 查询排序
 */
const queryOrder = {
  createTime: 'DESC',
};

/**
 * 新增公告
 */
const handleAddAnnouncement = () => {
  dynDialog.open(CompAnnouncementEditor, {}, { title: '新增公告' }).then((res) => {
    if (res.type === 'ok') {
      console.log('你点击了确定');
      refSearch.value?.resetFields();
      refPagination.value?.triggerSearch();
    } else {
      console.log('你点击了关闭');
    }
  });
};

/**
 * 编辑公告
 */
const handleEditAnnouncement = (_announcement) => {
  dynDialog.open(CompAnnouncementEditor, { announcementInfo: _announcement }, { title: '编辑公告' }).then((res) => {
    if (res.type === 'ok') {
      console.log('你点击了确定');
      refPagination.value?.triggerRefresh();
    } else {
      console.log('你点击了关闭');
    }
  });
};

/**
 * 删除公告
 */
const handleDelAnnouncement = (announcement) => {
  AnnouncementController.announcementBatchDel({ ids: [announcement.id] }, 'message').then(() => {
    createNotification.success('删除', '删除成功');
    refPagination.value?.triggerRefresh();
  });
};

/**
 * 查询公告列表
 */
const queryAnnouncementList = async (params = {}, callback: Fn) => {
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

onMounted(() => {
  refPagination.value?.triggerSearch();
});
</script>

<style scoped lang="scss"></style>
