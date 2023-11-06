<!--
  FileDesc  : MeetingRoomRoomList 会议室
  path      : src/views/pages/affairs/meeting/MeetingRoomRoomList.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v__meeting-room-list"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryMeetingRoomList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="80" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" @keypress.enter="triggerSearch">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchField.name" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item label="房号" prop="roomNumber">
          <el-input v-model="searchField.roomNumber" placeholder="房号" clearable />
        </el-form-item>
        <el-form-item v-if="!mobileMode">
          <el-button type="primary" :loading="queryStatus === queryStatusEnum.querying" @click="triggerSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作区域 ------------------------------------------------------------- -->

    <template #ops>
      <div class="flex px-4 pb-2 items-center justify-end">
        <el-button text type="success" @click="handleAddMeetingRoom">
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
            <el-descriptions size="small" :title="item.name" :column="2" direction="horizontal">
              <template #title>
                <div class="flex items-center">
                  <BaseIcon icon="ion:logo-windows"  class="mr-2"/>
                  <span class="font-extrabold text-base">{{ item.name }}</span>
                </div>
              </template>
              <el-descriptions-item label="房号" :span="1">{{ item.roomNumber || '-' }}</el-descriptions-item>
              <el-descriptions-item label="容纳人数" :span="1">{{ item.maxPersonCount || '-' }}</el-descriptions-item>
              <el-descriptions-item label="配置" :span="2">{{ item.equipmentIntro || '-' }}</el-descriptions-item>
              <el-descriptions-item label="地址" :span="2">{{ item.address || '-' }}</el-descriptions-item>

              <el-descriptions-item :span="2">
                <BaseCard class="text-xs leading-5">
                  <div>创建人:{{ item.createUser?.account || '-' }}</div>
                  <div>创建日期:{{ toDateStr(item.createTime) || '-' }}</div>
                </BaseCard>
              </el-descriptions-item>
            </el-descriptions>
            <template #footer>
              <div class="flex mt-2 justify-end">
                <div>
                  <el-popconfirm title="确定删除？" @confirm="handleDelMeetingRoom(item)">
                    <template #reference>
                      <el-button type="danger" size="small" class="mr-2"> <BaseIcon icon="ion:trash" /> 删除</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button type="primary" size="small" @click="handleEditMeetingRoom(item)"><BaseIcon icon="ion:create-outline" />编辑</el-button>
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
import { MeetingRoomController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { toDateStr } from '/@/libs/utils/dateUtil';
import { assignObj } from '/@/libs/utils/langUtil';
import CompMeetingRoomEditor from './components/CompMeetingRoomEditor.vue';
import BaseCard from '/@/components-base/BaseCard.vue';

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
  roomNumber: '', // 房号
});
/**
 * 查询排序
 */
const queryOrder = {
  createTime: 'DESC',
};
/**
 * 新增会议室
 */
const handleAddMeetingRoom = () => {
  dynDialog.open(CompMeetingRoomEditor, {}, { title: '新增', width: '500px' }).then((res) => {
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
 * 编辑会议室
 */
const handleEditMeetingRoom = (meetingRoom) => {
  dynDialog.open(CompMeetingRoomEditor, { meetingRoomInfo: meetingRoom }, { title: '编辑', width: '500px' }).then((res) => {
    if (res.type === 'ok') {
      console.log('你点击了确定');
      refPagination.value?.triggerRefresh();
    } else {
      console.log('你点击了关闭');
    }
  });
};

/**
 * 删除会议室
 */
const handleDelMeetingRoom = (meetingRoom) => {
  MeetingRoomController.meetingRoomBatchDel({ ids: [meetingRoom.id] }, 'message').then(() => {
    createNotification.success('删除', '删除成功');
    refPagination.value?.triggerRefresh();
  });
};

/**
 * 查询会议室列表
 */
const queryMeetingRoomList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await MeetingRoomController.meetingRoomList(params, 'message');
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
