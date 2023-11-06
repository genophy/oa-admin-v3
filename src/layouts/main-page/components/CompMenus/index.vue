<template>
  <div class="flex flex-col flex-1 relative">
    <!-- 查找菜单 -->
    <div v-if="searchAble" class="bg-white border-b flex flex-shrink-0 h-12 px-6 top-0 leading-12 z-10 sticky items-center dark:bg-dark-500">
      <BaseIcon :icon="IsMenuCollapsed ? 'ion-list-circle' : 'ion-list-circle-outline'" :size="24" class="cursor-pointer" @click="IsMenuCollapsed = !IsMenuCollapsed" />
      <el-autocomplete
        v-if="!IsMenuCollapsed"
        v-model="searchMenu"
        placeholder="搜索菜单"
        clearable
        :fetch-suggestions="handleQuerySearchMenuSeq"
        class="flex-grow ml-2 w-50"
        @select="handleSelectMenuSeq"
      >
        <template #suffix>
          <BaseIcon icon="ion-search" />
        </template>

        <template #default="{ item }">
          <div>{{ getCaseCadeMenuName(item) }}</div>
        </template>
      </el-autocomplete>
    </div>

    <div class="flex flex-col flex-1 pb-6 overflow-auto">
      <!--  -->
      <el-menu
        ref="refMenu"
        :default-openeds="menuDefaultOpeneds"
        :default-active="menuDefaultActive"
        class="flex-1"
        mode="vertical"
        :ellipsis="true"
        :collapse="IsMenuCollapsed"
        :unique-opened="uniqueOpened"
        @select="handleOpenMenu"
      >
        <template v-for="item in menus" :key="item.id">
          <CompMenusSubItem :menu="item" :show-icon="menuSetting.showIcon" />
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { find } from 'lodash-es';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CompMenusSubItem from './CompMenusSubItem.vue';
import { MenuItem } from '/#/store';
import BaseIcon from '/@/components-base/BaseIcon';
import { listenerRouteChange, removeTabChangeListener } from '/@/libs/logics/mitt/routeChange';
import { REDIRECT_NAME } from '/@/libs/router/constant';
import { useAppStore } from '/@/libs/store/modules/app';
import { useMenusStore } from '/@/libs/store/modules/menus';
import { genRouterProps } from '/@/libs/utils/commons';
import { resolveMenuItemFromRoute } from '/@/libs/utils/menuUtil';
import { propTypes } from '/@/libs/utils/propTypes';
import { unref } from 'vue';
import { useRootSetting } from '/@/libs/hooks/setting/useRootSetting';

defineProps({
  searchAble: propTypes.bool.def(true), // 是否显示查找输入框
});
const emits = defineEmits(['select']);

const router = useRouter();
const menusStore = useMenusStore();
const appStore = useAppStore();
const menus = computed(() => menusStore.getMenus);

const menusSeq = computed(() => menusStore.getMenusSeq);
const projConfig = computed(() => appStore.getProjectConfig);
const menuSetting = computed(() => projConfig.value.menuSetting);

const menuDefaultActive = ref('0');
const menuDefaultOpeneds: any = ref([]);

// const isCollapse = ref(false);

const { IsMenuCollapsed } = useRootSetting();

const uniqueOpened = ref(menuSetting.value.uniqueOpened);

const searchMenu = ref('');
const refMenu = ref();

/**
 * 搜索菜单
 */
const handleQuerySearchMenuSeq = (queryString: string, cb: any) => {
  if (!queryString) return cb([]);

  const list = menusSeq.value.filter((item) => ~`${item.name}`.indexOf(queryString));
  cb(unref(list));
};

/**
 * 选择已搜索的菜单
 */
const handleSelectMenuSeq = (item: MenuItem | any) => {
  // 若是菜单目录，则展开
  if (item.type === 'FOLDER') {
    // refMenu.value.open(`${item.id}`);
    refMenu.value.open(`${item.id}`);
  } else {
    router.push(genRouterProps(item.url));
  }
};

/**
 *
 * @param key
 * @param keyPath
 */
const handleOpenMenu = (key: string) => {
  const menu = find(unref(menusSeq), (item) => `${item.id}` === key);
  if (menu?.url) {
    menuDefaultActive.value = `${menu.id}`;
    router.push(genRouterProps(menu.url));
    emits('select', menu);
  } else {
    console.error(menu);
    ElMessage('未发现此菜单地址.');
  }
};

/**
 * 组合菜单名称
 */
const getCaseCadeMenuName = (_item: MenuItem | any, split = '-') => {
  return [...(_item.parents || []).map((item) => item.name), _item.name].join(split);
};
// 监听路由改变
listenerRouteChange((route) => {
  const { name } = route;
  if (name === REDIRECT_NAME || !route) {
    return;
  }

  if (route?.fullPath) {
    const menu: Nullable<MenuItem> = resolveMenuItemFromRoute(route);

    if (menu) {
      // refMenu.value.open(`${menu.id}`);
      if (!menu.url) {
        menuDefaultOpeneds.value = [...[(menu.parents as any) || []].map((i) => i.id), `${menu.id}`];
        menuDefaultActive.value = '';
      } else {
        menuDefaultOpeneds.value = ((menu.parents as any) || []).map((i) => i.id);
        menuDefaultActive.value = `${menu.id}`;
      }
      return;
    }
  }

  menuDefaultOpeneds.value = [];
  menuDefaultActive.value = '';
}, true);
// 加载
onMounted(() => {});

onBeforeUnmount(() => {
  removeTabChangeListener();
});
</script>

<style scoped lang="scss"></style>
