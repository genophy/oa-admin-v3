<template>
  <!--  -->
  <div v-if="getTabsState.length > 0" class="flex w-full c__multiple-tabs">
    <div class="flex-grow w-full overflow-hidden">
      <el-tabs v-model="currentRouteFullPath" size="small" class="flex-grow w-full select-none" :stretch="false" @edit="handleTabsEdit" @tab-change="handleTabsChange">
        <el-tab-pane v-for="(item, idx) in getTabsState" :key="(item.fullPath as any)" :closable="currentRouteFullPath === item.fullPath" :label="item.meta.title" :name="item.fullPath">
          <template v-if="currentRouteFullPath === item.fullPath" #label>
            <el-dropdown trigger="contextmenu" class="h-full" @command="handleSelectContextMenu($event)">
              <div class="flex justify-center items-center">
                <span>{{ item.meta.title }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="refresh"> <BaseIcon icon="ion:refresh" /> 刷新</el-dropdown-item>
                  <el-dropdown-item command="xLeft" :disabled="idx === 0"> <BaseIcon icon="ion-arrow-undo-circle" /> 关闭左侧所有 </el-dropdown-item>
                  <el-dropdown-item command="xRight" :disabled="idx >= getTabsState.length - 1"> <BaseIcon icon="ion-arrow-redo-circle" /> 关闭右侧所有</el-dropdown-item>
                  <el-dropdown-item command="xCurrent"> <BaseIcon icon="ion-close-outline" />关闭</el-dropdown-item>
                  <el-dropdown-item command="xOther" :disable="getTabsState.length > 1"> <BaseIcon icon="ion-ellipse-outline" /> 关闭其他</el-dropdown-item>
                  <el-dropdown-item command="xAll"><BaseIcon icon="ion-close-circle-outline" />关闭所有</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="flex flex-shrink-0 h-10 ml-2 items-end">
      <el-button plain @click="handleCloseAllTabs">关闭所有</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, unref } from 'vue';
import { RouteLocationNormalized, RouteMeta, useRouter } from 'vue-router';
import { useGo } from '/@/libs/hooks/web/usePage';
import { listenerRouteChange, removeTabChangeListener } from '/@/libs/logics/mitt/routeChange';
import { PAGE_NOT_FOUND_NAME, REDIRECT_NAME } from '/@/libs/router/constant';
import { useMultipleTabStore } from '/@/libs/store/modules/multipleTab';

import { useTabs } from '/@/libs/hooks/web/useTabs';
import { useMenusStore } from '/@/libs/store/modules/menus';
import { find } from 'lodash-es';
import BaseIcon from '/@/components-base/BaseIcon';

const menusStore = useMenusStore();
const tabStore = useMultipleTabStore();
const router = useRouter();
const go = useGo();
const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
const getTabsState = computed(() => {
  return tabStore.getTabList.filter((item) => !item.meta?.hideTab);
});

const currentRouteFullPath = ref('');

const menuSeq = computed(() => menusStore.getMenusSeq);

const handleTabsChange = (paneName: any) => {
  go(paneName as any, false);
};

/**
 * 改变tabs
 */
const handleTabsEdit = (paneName: any, action: 'remove' | 'add') => {
  if (action === 'add') {
  } else if (action === 'remove') {
    tabStore.closeTabByKey(`${paneName}`, router);
  }
};

/**
 * 关闭所有菜单
 */
const handleCloseAllTabs = () => {
  // tabStore.closeAllTab(router);
  closeAll();
};

const handleSelectContextMenu = async (command) => {
  switch (command) {
    case 'refresh':
      await refreshPage();
      break;
    case 'xLeft':
      await closeLeft();
      break;
    case 'xRight':
      await closeRight();
      break;
    case 'xCurrent':
      await close();
      break;
    case 'xOther':
      await closeOther();
      break;
    case 'xAll':
      await closeAll();
      break;

    default:
      break;
  }
};

listenerRouteChange((route) => {

  const { name } = route;
  if (name === REDIRECT_NAME || name === PAGE_NOT_FOUND_NAME || !route) {
    currentRouteFullPath.value = '';
    return;
  }

  const { path, fullPath, meta = {} } = route;
  const { currentActiveMenu, hideTab } = meta as RouteMeta;
  const isHide = !hideTab ? null : currentActiveMenu;
  const p = isHide || fullPath || path;
  if (currentRouteFullPath.value !== p) {
    currentRouteFullPath.value = p as string;
  }

  if (isHide) {
    const findParentRoute = router.getRoutes().find((item) => item.path === currentActiveMenu);

    findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized);
  } else {
    if (route.name === 'IframePage' && /^http/.test((route.query as any).src)) {
      route.meta.title = find(unref(menuSeq), (item) => item.url === route.query.src)?.name || route.meta.title;
    } else {
      route.meta.title = find(unref(menuSeq), (item) => item.url === route.fullPath)?.name || route.meta.title;
    }
    tabStore.addTab(unref(route));
  }
}, true);

onBeforeUnmount(() => {
  tabStore.resetState();
  removeTabChangeListener();
});
</script>

<style scoped lang="scss"></style>
