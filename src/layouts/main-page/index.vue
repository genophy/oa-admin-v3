<template>
  <div v-if="isPageLoading">加载中... </div>
  <template v-else-if="isFullPage"><SinglePage /> </template>
  <el-container v-else class="h-full overflow-hidden">
    <el-header class="border-b">
      <CompMainHeader class="h-full" />
    </el-header>

    <el-container class="overflow-hidden">
      <el-aside v-if="!getMobileMode" width="auto">
        <CompMainSider />
      </el-aside>
      <el-container direction="vertical">
        <div class="flex-shrink-0 py-2 px-6">
          <CompMainMultipleTabs v-if="isShowMultipleTab" />
          <CompBreadcrumb v-if="getShowBreadCrumb" />
        </div>
        <el-main class="relative">
          <SinglePage />
        </el-main>
        <el-footer v-if="getShowFooter">
          <CompMainFooter />
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
/* ****************************************************************** */
/* props emits  ----------------------------------------------------- */
/* const let (use store) ------ß------------------------------------- */
/* compute watch subscribe ------------------------------------------ */
/* method (handle public private) ----------------------------------- */
/* life cycle ------------------------------------------------------- */
/* expose ----------------------------------------------------------- */
/* ****************************************************************** */

import { computed, onMounted, ref, unref } from 'vue';
import SinglePage from '../single-page/index.vue';
import CompBreadcrumb from './components/CompBreadcrumb/index.vue';
import CompMainFooter from './components/CompMainFooter.vue';
import CompMainHeader from './components/CompMainHeader.vue';
import CompMainSider from './components/CompMainSider.vue';
import CompMainMultipleTabs from './components/CompMultipleTabs/index.vue';
import { useMultipleTabSetting } from '/@/libs/hooks/setting/useMultipleTabSetting';
import { useRootSetting } from '/@/libs/hooks/setting/useRootSetting';
import { useAppStore } from '/@/libs/store/modules/app';
import { useMenusStore } from '/@/libs/store/modules/menus';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';

const menusStore = useMenusStore();
// const userStore = useUserStore();
const isPageLoading = ref(true);
const appStore = useAppStore();

const { getShowMultipleTab } = useMultipleTabSetting();
const { getShowFooter, getShowBreadCrumb } = useRootSetting();
const remoteFullDataStore = useRemoteFullDataStore();

const getMobileMode = computed(() => appStore.getMobileMode);

const isShowMultipleTab = computed(() => unref(getShowMultipleTab) && !unref(getMobileMode));

const isFullPage = computed(() => appStore.getFullPage);

// const fetchMenu = () => {
//   return MenuController.list({}, 'message').then((data) => {
//     menusStore.setMenus(data);
//   });
// };

onMounted(() => {
  Promise.all([menusStore.initMenusPermission(), remoteFullDataStore.queryAnnouncementIdsRead()]).finally(() => (isPageLoading.value = false));
});
</script>

<style scoped lang="scss"></style>
