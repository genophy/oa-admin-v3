<!--
  FileDesc  : CarAppointmentOverview 车辆预约概况
  path      : src/views/pages/affairs/car/CarAppointmentOverview.vue
  Author    : genophy
  Version   :
  Usage     :
-->

<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v-car-appointment-overview"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryCarList"
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
        <el-button text type="success" @click="handleViewMyCarAppointments">
          <BaseIcon icon="ion:list-outline" :size="18" class="mr-2" />
          我的申请</el-button
        >
      </div>
    </template>

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <div class="flex">
        <!-- 纵列车辆 -->
        <div>
          <div class="flex-shrink-0 h-12 m-2 text-xs w-40">
            <div></div>
          </div>
          <BaseCard v-for="item in list" :key="item" class="h-40 m-2 text-xs w-40">
            <div class="flex items-end justify-between">
              <BaseImage :img-list="getImageHex(item.carImages)" :size="48" preview>
                <template #error>
                  <div class="flex h-full justify-center items-center">
                    <BaseSvgIcon name="car" size="32" fill="#CFD3DC" />
                    <!-- <BaseIcon icon="ion:image" :size="48" class="text-2xl text-gray-200 dark:text-gray-600" /> -->
                  </div>
                </template>
              </BaseImage>
              <div class="font-bold text-sm">苏A100{{ item }}</div>
            </div>
            <div class="flex mt-2 text-xs opacity-60 justify-between">
              <div>大众-帕萨特</div>
              <div>5座</div>
            </div>
            <div class="flex mt-2 text-xs opacity-60 justify-between">
              <div>2022</div>
            </div>
            <!-- <div class="border mt-2 p-1 ly-border">
              <BaseTooltip content="abc"> <div class="break-words line-clamp-3">投影仪，白板 3242342342332423423423324234234233242342342332423423423 </div></BaseTooltip>
            </div> -->
          </BaseCard>
        </div>
        <!-- 横列 -->
        <div class="flex-grow overflow-x-auto">
          <!-- 日期 -->
          <div class="flex flex-nowrap my-2 text-xs text-center">
            <div
              v-for="(item, idx) in days"
              :key="idx"
              class="flex flex-col flex-shrink-0 h-12 mx-2 w-50 justify-center"
              :class="{ 'bg-lime-600 text-white': item.weekNum === 6 || item.weekNum === 0, 'bg-gray-600 text-white': item.weekNum !== 6 && item.weekNum !== 0 }"
            >
              <div class="font-bold text-sm">{{ item.dayStr }}</div>
              <div>{{ listFind(item.weekNum, WEEK, 'id', 'name') }}</div>
            </div>
          </div>
          <div v-for="item in list" :key="item" class="my-2">
            <div class="flex flex-nowrap">
              <div v-for="(_day, idx) in days" :key="idx" class="border flex-shrink-0 h-40 mx-2 text-xs p-2 w-50 overflow-auto">
                <div class="flex mb-2 justify-end">
                  <ElButton link @click="handleAddCarAppointment(item)">
                    <template #icon>
                      <BaseIcon icon="ion:add-circle-outline" :size="24" class="text-lime-600 ly-btn" />
                    </template>
                  </ElButton>
                </div>
                <div class="border rounded flex m-1 py-1 px-2 meeting-item justify-between items-center ly-btn">
                  <div class="flex">
                    <BaseIcon icon="ion:person" size="14px" class="mr-2" />
                    <span class=""> 张三</span>
                  </div>
                  <ElTag type="success" size="small">
                    <span>10:00</span>
                    <span>~</span>
                    <span>12:00</span>
                  </ElTag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseQueryDataPagination>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { range } from 'lodash-es';
import { getCurrentInstance, onMounted, reactive, Ref, ref, unref } from 'vue';
import CompCarAppointment from './components/CompCarAppointment.vue';
import CompMyCarAppointments from './components/CompMyCarAppointments.vue';
import BaseCard from '/@/components-base/BaseCard.vue';
import BaseIcon, { BaseSvgIcon } from '/@/components-base/BaseIcon';
import BaseImage from '/@/components-base/BaseImage/BaseImage.vue';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { WEEK } from '/@/libs/utils/constants';
import { dateUtil } from '/@/libs/utils/dateUtil';
import { assignObj, listFind } from '/@/libs/utils/langUtil';

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

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
const todayDate = dateUtil().hour(0).minute(0).second(0).millisecond(0);

const days = range(0, 6).map((_v, idx) => {
  const _d = todayDate.clone().add(idx, 'day');
  const dayStr = _d.format('YYYY-MM-DD');
  const weekNum = _d.day();
  return {
    date: _d,
    isToday: idx === 0,
    dayStr,
    weekNum,
  };
});

/**
 * 查看所有我的预约
 */
const handleViewMyCarAppointments = () => {
  dynDialog.open(CompMyCarAppointments, {}, { title: '我的预约车辆', width: '600px' }).then(() => {
    refPagination.value?.triggerRefresh();
  });
};

/**
 * 新增车辆预约
 */
const handleAddCarAppointment = (meetingRoom) => {
  dynDialog.open(CompCarAppointment, { meetingRoom }, { title: '新增预约', width: '600px' }).then((res) => {
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
 * 获取图片 hex
 * @param imageHex
 */
const getImageHex = (imageHex = '') => {
  return (imageHex || '').split(',');
};
/**
 * 查询车辆列表
 */
const queryCarList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = { list: [1, 2, 3, 4, 5], total: 1 }; //  await CarController.meetingList(params, 'message');
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
