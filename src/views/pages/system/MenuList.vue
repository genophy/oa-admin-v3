<!--
  FileDesc  : 
  path      :
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryTreePage :query-status="queryStatus" @dual-change="showMenuInfoDrawer = false">
    <template #search>
      <div class="flex flex-shrink-0 mb-2 justify-between">
        <div class="w-60">
          <el-input v-model="searchKey" placeholder="定位菜单" clearable @keypress.enter="handlePositionMenu">
            <template #suffix>
              <BaseIcon icon="ion:locate" />
            </template>
          </el-input>
        </div>
        <div>
          <el-button text type="primary" @click="fetchAdminMenu">
            <BaseIcon icon="ion-refresh" />
            刷新</el-button
          >
        </div>
        <div class="flex-grow flex justify-end">
          <el-button text type="success" @click="handleAddMenu">
            <BaseIcon icon="ion-add-outline" />
            新增</el-button
          >
        </div>
      </div>
    </template>
    <template #default>
      <el-scrollbar ref="refMenuContainer" class="flex-grow pb-4 overflow-auto">
        <div v-for="mItem in menus" :key="mItem.id">
          <CompMenuItem :menu="mItem" class="my-2" />
        </div>
      </el-scrollbar>
    </template>
    <template #fail>
      <el-empty :description="queryStatus === queryStatusEnum.empty ? '暂无数据' : '数据异常'" />
    </template>
    <template #edit>
      <div class="flex-grow overflow-auto">
        <CompMenuInfoEditor :menu="selectMenu" del-able class="h-full" @ok="fetchAdminMenu" />
      </div>
    </template>
    <template #drawerEdit="{ width }">
      <el-drawer v-model="showMenuInfoDrawer" :size="width" direction="rtl" :before-close="handleCloseMenuInfoDrawer">
        <template #header>
          <h4>菜单详情</h4>
        </template>
        <template #default>
          <CompMenuInfoEditor :menu="selectMenu" del-able @close="showMenuInfoDrawer = false" @ok="fetchAdminMenu" />
        </template>
      </el-drawer>
    </template>
  </BaseQueryTreePage>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus';
import { computed, getCurrentInstance, onMounted, Ref, ref, unref, watch } from 'vue';
import CompMenuInfoEditor from './components/CompMenuInfoEditor.vue';
import CompMenuItem from './components/CompMenuItem.vue';
import { MenuController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseQueryTreePage from '/@/components-base/BaseTreeContainer/BaseQueryTreePage.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useSingleSelectedStore } from '/@/libs/store/modules/singleSelected';

const singleSelectedStore = useSingleSelectedStore();

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);

const searchKey = ref('');
const showMenuInfoDrawer = ref(false);

const refMenuContainer = ref<InstanceType<typeof ElScrollbar>>();
const menus: any = ref([]);
const selectMenu = computed(() => singleSelectedStore.getSelectedMenu);

watch(
  () => selectMenu.value,
  (v) => {
    if (v?.id) showMenuInfoDrawer.value = true;
  },
);

/**
 * 定位菜单
 */
const handlePositionMenu = () => {
  let top = 0;
  if (unref(searchKey)) {
    const eles: any = document.querySelectorAll(`[data-title]`);
    for (let i = 0; i < eles.length; i++) {
      if (~(eles[i].attributes['data-title'].value || '').indexOf(unref(searchKey))) {
        top = eles[i].offsetTop; // i * (eles[i].offsetHeight + 3);
        console.log('offsetTop:', eles[i].offsetTop);
        break;
      }
    }
  }
  refMenuContainer.value!.setScrollTop(top);
};
/**
 * 关闭菜单Drawer
 */
const handleCloseMenuInfoDrawer = (done) => {
  singleSelectedStore.setSelectedMenu({});
  done();
};

/**
 * 新增菜单
 */
const handleAddMenu = () => {
  const m = unref(selectMenu);
  const parentId = m.type === 'FOLDER' ? m.id : m.parentId;
  dynDialog.open(CompMenuInfoEditor, { isAdd: true, menu: { parentId } }, { title: '新增', width: '600px' }).then((res) => {
    if (res.type === 'ok') {
      fetchAdminMenu(res.body);
    }
  });
};

/**
 * 查询管理员权限的菜单树
 */
const fetchAdminMenu = (e = 'add') => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  queryStatus.value = queryStatusEnum.querying;
  if (e === 'del') singleSelectedStore.setSelectedMenu({});

  return MenuController.menuTreeAll({}, 'message')
    .then((treeData) => {
      menus.value = treeData;
    })
    .finally(() => {
      queryStatus.value = unref(menus).length > 0 ? queryStatusEnum.finish : queryStatusEnum.empty;
    });
};

onMounted(() => {
  fetchAdminMenu();
});
</script>

<style scoped lang="scss"></style>
