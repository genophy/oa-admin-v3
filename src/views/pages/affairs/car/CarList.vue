<!--
  FileDesc  : CarList 车辆列表
  path      : src/views/pages/affairs/car/CarList.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v-car-list"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryCarList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="100" class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]" @keypress.enter="triggerSearch">
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
        <el-button text type="success" @click="handleAddCar">
          <BaseIcon icon="ion-add-outline" />
          新增</el-button
        >
      </div>
    </template>

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <div class="grid p-4 gap-2 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        <template v-for="item in list" :key="item.id">
          <BaseCard class="relative">
            <el-descriptions :column="2" size="small" direction="horizontal">
              <el-descriptions-item :span="2">
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-lg">{{ item.carNumber }}</span>

                  <BaseImage :img-list="getImageHex(item.carImageHexes)" :size="80" preview>
                    <template #error>
                      <div class="flex h-full justify-center items-center">
                        <BaseSvgIcon name="car" size="48" fill="#CFD3DC" />
                        <!-- <BaseIcon icon="ion:image" :size="48" class="text-2xl text-gray-200 dark:text-gray-600" /> -->
                      </div>
                    </template>
                  </BaseImage>
                </div></el-descriptions-item
              >

              <el-descriptions-item label="品牌" :span="1">{{ item.brand || '-' }}</el-descriptions-item>
              <el-descriptions-item label="型号" :span="1">{{ item.model || '-' }}</el-descriptions-item>
              <el-descriptions-item label="年份" :span="1">{{ item.year || '-' }}</el-descriptions-item>
              <el-descriptions-item label="颜色" :span="1">{{ item.color || '-' }}</el-descriptions-item>
              <el-descriptions-item label="座位数" :span="1">{{ item.seating || '-' }}</el-descriptions-item>
              <el-descriptions-item label="购入时间" :span="1">{{ toDateStr(item.buyTime, 'YYYY-MM-DD') || '-' }}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ item.remark || '-' }}</el-descriptions-item>
              <el-descriptions-item label="创建日期" :span="2">{{ toDateStr(item.createTime) || '-' }}</el-descriptions-item>
            </el-descriptions>
            <template #footer>
              <div class="flex mt-2 justify-end">
                <div>
                  <el-popconfirm title="确定删除？" @confirm="handleDelCar(item)">
                    <template #reference>
                      <el-button type="danger" size="small" class="mr-2"> <BaseIcon icon="ion:trash" /> 删除</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button type="primary" size="small" @click="handleEditCar(item)"><BaseIcon icon="ion:create-outline" />编辑</el-button>
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
import CompCarEditor from './components/CompCarEditor.vue';
import { CarController } from '/@/api';
import BaseCard from '/@/components-base/BaseCard.vue';
import BaseIcon, { BaseSvgIcon } from '/@/components-base/BaseIcon';
import BaseImage from '/@/components-base/BaseImage/BaseImage.vue';
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
 * 获取图片 hex
 * @param imageHex
 */
const getImageHex = (imageHex = '') => {
  return (imageHex || '').split(',');
};

/**
 * 新增会议
 */
const handleAddCar = () => {
  dynDialog.open(CompCarEditor, {}, { title: '新增' }).then((res) => {
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
 * 编辑会议
 */
const handleEditCar = (car) => {
  dynDialog.open(CompCarEditor, { carInfo: car }, { title: '编辑' }).then((res) => {
    if (res.type === 'ok') {
      console.log('你点击了确定');
      refPagination.value?.triggerRefresh();
    } else {
      console.log('你点击了关闭');
    }
  });
};

/**
 * 删除会议
 */
const handleDelCar = (car) => {
  CarController.carBatchDel({ ids: [car.id] }, 'message').then(() => {
    createNotification.success('删除', '删除成功');
    refPagination.value?.triggerRefresh();
  });
};

/**
 * 查询会议列表
 */
const queryCarList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await CarController.carList(params, 'message');
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
