<!--
  FileDesc  : CompMyMeetingAppointments 我的所有预约会议
  path      : src/views/pages/affairs/meeting/components/CompMyMeetingAppointments.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v-comp-my-meeting-appointments"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryMeetingList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <!-- 操作区域 ------------------------------------------------------------- -->

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <div class="min-h-80">
        <div v-for="item in list" :key="item" class="mb-2 py-4 px-8">
          <BaseCard class="relative">
            <el-popconfirm :title="`确定删除？`" @confirm="handleDel()">
              <template #reference>
                <BaseIcon icon="ion:close-circle" size="24px" class="cursor-pointer text-lg -top-2 -right-2 text-red-500 z-10 icon-del absolute" />
              </template>
            </el-popconfirm>

            <div class="flex">
              <div class="border-r flex flex-col flex-shrink-0 text-center px-4 w-20 justify-center">
                <div class="font-bold text-base mb-2">03-20</div>
                <div class="text-xs">周三</div>
              </div>

              <div class="flex-grow px-4">
                <div class="flex justify-between">
                  <div class="mb-2">
                    <BaseIcon icon="ion:logo-windows" class="mr-2" />
                    <span class="font-extrabold text-base">{{ meetingRoom.name }}</span>
                  </div>
                  <ElTag type="success" size="small">
                    <span>10:00</span>
                    <span>~</span>
                    <span>12:00</span>
                  </ElTag>
                </div>

                <div class="text-xs leading-6">
                  <div class="flex">
                    <span class="flex-1">房号：{{ meetingRoom.roomNumber || '-' }}</span>
                    <span class="flex-1">容纳人数：{{ meetingRoom.maxPersonCount || '-' }}</span>
                  </div>
                  <div class="truncate">地址：{{ meetingRoom.address || '-' }}</div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </template>
  </BaseQueryDataPagination>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { onMounted, reactive, Ref, ref, unref } from 'vue';
import BaseCard from '/@/components-base/BaseCard.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { assignObj } from '/@/libs/utils/langUtil';

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

const meetingRoom = {
  name: '会议室1',
  roomNumber: '123',
  maxPersonCount: 12,
  equipmentIntro:
    '234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234',
  address: '234234324234234234',
};
/**
 * 删除
 */
const handleDel = () => {};
/**
 * 查询会议列表
 */
const queryMeetingList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = { list: [1, 2, 3, 4, 5], total: 1 }; //  await MeetingController.meetingList(params, 'message');
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
