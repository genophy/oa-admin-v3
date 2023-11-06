<template>
  <!--  -->
  <el-menu
    ref="refMenu"
    :default-openeds="menuDefaultOpeneds"
    :default-active="menuDefaultActive"
    class="h-full flex-1 select-none"
    mode="horizontal"
    :ellipsis="false"
    :collapse="isCollapse"
    :unique-opened="uniqueOpened"
    @select="handleClickMenuItem"
  >
    <el-sub-menu index="0">
      <template #title>
        <BaseIcon icon="ion:menu" :size="24" />
      </template>

      <template v-for="item in menus" :key="item.id">
        <CompMenusSubItem :menu="item" :show-icon="menuSetting.showIcon" />
      </template>
    </el-sub-menu>
  </el-menu>
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

const router = useRouter();
const menusStore = useMenusStore();
const appStore = useAppStore();
const menus = computed(() => menusStore.getMenus);
const menusSeq = computed(() => menusStore.getMenusSeq);
const projConfig = computed(() => appStore.getProjectConfig);
const menuSetting = computed(() => projConfig.value.menuSetting);

const menuDefaultActive = ref('0');
const menuDefaultActivePrev = ref('0');
const menuDefaultOpeneds: any = ref([]);

const isCollapse = ref(false);
const uniqueOpened = ref(menuSetting.value.uniqueOpened);

const refMenu = ref();

/**
 *
 * @param key
 * @param keyPath
 */
const handleClickMenuItem = (key: string) => {
  const menu = find(menusSeq.value, (item) => `${item.id}` === key);
  menusStore.setActivateMenu(menu as MenuItem);

  if (menu?.url) {
    menuDefaultActive.value = `${menu.id}`;
    menuDefaultActivePrev.value = menuDefaultActive.value;
    router.push(genRouterProps(menu.url));
  } else {
    console.error(menu);
    ElMessage('未发现此菜单地址.');
  }
};
// 监听路由改变
listenerRouteChange((route) => {
  const { name } = route;
  if (name === REDIRECT_NAME || !route) {
    return;
  }

  if (route?.fullPath) {
    const menu: Nullable<MenuItem> = resolveMenuItemFromRoute(route);
    menusStore.setActivateMenu(menu);
    if (menu) {
      // refMenu.value.open(`${menu.menuId}`);
      if (!menu.url) {
        menuDefaultOpeneds.value = [...[menu.parents as any], `${menu.id}`];
        menuDefaultActive.value = '';
      } else {
        menuDefaultOpeneds.value = (menu.parents as any) || [];
        menuDefaultActive.value = `${menu.id}`;
      }
    } else {
      menuDefaultActive.value = '';
    }
  }
}, true);

// 加载
onMounted(() => {});

onBeforeUnmount(() => {
  removeTabChangeListener();
});
</script>

<style scoped lang="scss"></style>
