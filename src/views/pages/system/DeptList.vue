<!--
  FileDesc  : 
  path      :
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryTreePage :query-status="queryStatus" @dual-change="showDeptDrawer = false">
    <template #search>
      <div class="flex flex-shrink-0 mb-2 justify-between">
        <div class="w-60">
          <el-input v-model="searchKey" placeholder="定位部门" clearable @keypress.enter="handlePositionDept">
            <template #suffix>
              <BaseIcon icon="ion:locate" />
            </template>
          </el-input>
        </div>
        <div>
          <el-button text type="primary" @click="fetchDept">
            <BaseIcon icon="ion-refresh" />
            刷新</el-button
          >
        </div>
        <div class="flex-grow flex justify-end">
          <el-button text type="success" @click="handleAddDept">
            <BaseIcon icon="ion-add-outline" />
            新增</el-button
          >
        </div>
      </div>
    </template>

    <template #default>
      <el-scrollbar ref="refDeptContainer" class="flex-grow pb-4 overflow-auto">
        <div v-for="mItem in deptTree" :key="mItem.id">
          <CompDeptItem :dept="mItem" class="my-2" />
        </div>
      </el-scrollbar>
    </template>
    <template #fail>
      <el-empty :description="queryStatus === queryStatusEnum.empty ? '暂无数据' : '数据异常'" />
    </template>
    <template #edit>
      <div class="flex-grow overflow-auto">
        <CompDeptEditor :dept="selectDept" del-able class="h-full" @ok="fetchDept()" />
      </div>
    </template>
    <template #drawerEdit="{ width }">
      <el-drawer v-model="showDeptDrawer" :size="width" direction="rtl" :before-close="handleCloseDeptDrawer">
        <template #header>
          <h4>部门详情</h4>
        </template>
        <template #default>
          <CompDeptEditor :dept="selectDept" del-able @ok="fetchDept()" />
        </template>
      </el-drawer>
    </template>
  </BaseQueryTreePage>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus';
import { computed, getCurrentInstance, onMounted, Ref, ref, unref, watch } from 'vue';
import CompDeptEditor from './components/CompDeptEditor.vue';
import CompDeptItem from './components/CompDeptItem.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseQueryTreePage from '/@/components-base/BaseTreeContainer/BaseQueryTreePage.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { useSingleSelectedStore } from '/@/libs/store/modules/singleSelected';

const singleSelectedStore = useSingleSelectedStore();
const remoteFullDataStore = useRemoteFullDataStore();
// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);

const searchKey = ref('');
const showDeptDrawer = ref(false);

const refDeptContainer = ref<InstanceType<typeof ElScrollbar>>();
const deptTree = computed(() => remoteFullDataStore.getDeptTree);
const selectDept = computed(() => singleSelectedStore.getSelectedDept);

watch(
  () => selectDept.value,
  (v) => {
    if (v?.id) showDeptDrawer.value = true;
  },
);
/**
 * 定位部门
 */
const handlePositionDept = () => {
  let top = 0;
  if (searchKey.value) {
    const eles: any = document.querySelectorAll(`[data-title]`);
    for (let i = 0; i < eles.length; i++) {
      if (~(eles[i].attributes['data-title'].value || '').indexOf(searchKey.value)) {
        top = eles[i].offsetTop; // i * (eles[i].offsetHeight + 3);
        console.log('offsetTop:', eles[i].offsetTop);
        break;
      }
    }
  }
  refDeptContainer.value!.setScrollTop(top);
};

/**
 * 关闭部门drawer
 */
const handleCloseDeptDrawer = (done) => {
  singleSelectedStore.setSelectedDept({});
  done();
};

/**
 * 新增部门
 */
const handleAddDept = () => {
  dynDialog.open(CompDeptEditor, { isAdd: true, dept: { parentId: unref(selectDept)?.id } }, { title: '新增' });
};

/**
 * 查询部门
 */
const fetchDept = () => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  queryStatus.value = queryStatusEnum.querying;
  singleSelectedStore.setSelectedDept({});

  return remoteFullDataStore.queryDeptTree('message').finally(() => {
    queryStatus.value = unref(deptTree).length > 0 ? queryStatusEnum.finish : queryStatusEnum.empty;
  });
};

onMounted(() => {
  fetchDept();
});
</script>

<style scoped lang="scss"></style>
