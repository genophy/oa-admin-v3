<template>
  <!--  -->
  <div class="c__menu-item relative" :class="{ 'show-l-line': childrenMenus.length > 0, 'is-child': isChild }" :data-title="menu.name">
    <div
      :class="{ 'text-blue-500': currentMenu?.id === menu.id }"
      class="border cursor-pointer py-2 pr-8 pl-2 c__menu-item__inner relative select-none hover:bg-blue-50 active:opacity-80 dark:hover:bg-light-blue-900"
      @click="handleSelect(menu)"
    >
      <div class="flex mb-1 justify-between  items-center">
        <div class="flex items-center overflow-hidden">
          <div class="mx-2 text-base opacity-60">
            <BaseIcon v-if="menu.icon" :icon="menu.icon" :size="12" />
            <BaseIcon v-else-if="menu.type === 'FOLDER'" icon="ion:folder-outline" :size="12" />
            <BaseIcon v-else-if="menu.type === 'ROUTE'" icon="ion:menu"  :size="12" />
            <BaseIcon v-else-if="menu.type === 'REDIRECT'" icon="ion:radio-button-off" :size="12" />
            <BaseIcon v-else icon="ion:browsers-outline" :size="12" />
          </div>
          <div class="truncate" :title="menu.name">
            {{ menu.name }}
          </div>
        </div>
        <div class="flex flex-shrink-0 text-xs opacity-40 items-center">
          <BaseIcon icon="ion-swap-vertical" class="mx-2" :size="12" />
          {{ menu.sorting || '-' }}
        </div>
      </div>
      <div class="flex flex-nowrap text-xs opacity-60 justify-between">
        <div class="mx-2 truncate">
          {{ menu.url }}
        </div>
        <!-- 子目录 子菜单 外链 按钮 -->
        <div class="flex opacity-40">
          <template v-if="menu.type === 'FOLDER'">
            <BaseIcon icon="ion:folder-outline" class="mx-2"  :size="12" />
            <span>{{ childrenFoldCount }}</span>
            <BaseIcon icon="ion:menu" class="mx-2"  :size="12" />
            <span>{{ childrenMenuCount }}</span>
            <BaseIcon icon="ion:link" class="mx-2"  :size="12" />
            <span>{{ childrenLinkCount }}</span>
          </template>
        </div>
      </div>
    </div>

    <div v-if="childrenMenus.length > 0" class="pt-2 pl-8 c_menu-children">
      <CompMenuItem v-for="item in childrenMenus" :key="item.id" :menu="item" :is-child="true" class="mb-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import BaseIcon from '/@/components-base/BaseIcon/src/BaseIcon.vue';
import { useSingleSelectedStore } from '/@/libs/store/modules/singleSelected';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  // title, icon,children,
  menu: propTypes.object.def({}),
  isChild: propTypes.bool.def(false),
});

const singleSelectedStore = useSingleSelectedStore();

const currentMenu = computed(() => singleSelectedStore.getSelectedMenu);

// 子目录个数
const childrenFoldCount = ref(0);
// 子菜单个数
const childrenMenuCount = ref(0);
// 子链接个数
const childrenLinkCount = ref(0);
// 子目录
const childrenMenus = ref([] as any);

watch(
  () => props.menu,
  (_menu) => {
    const children = cloneDeep(_menu.children || []);
    childrenMenus.value.length = 0;
    if (children.length > 0) {
      let foldCount = 0;
      let menuCount = 0;
      let linkCount = 0;
      let btnCount = 0;
      children.forEach((item) => {
        if (item.TYPE === 'FOLDER') {
          foldCount++;
          childrenMenus.value.push(item);
        } else if (item.type === 'ROUTE') {
          menuCount++;
          childrenMenus.value.push(item);
        } else if (item.type === 'REDIRECT') {
          linkCount++;
          childrenMenus.value.push(item);
        } else {
          btnCount++;
          childrenMenus.value.push(item);
        }
      });
      childrenFoldCount.value = foldCount;
      childrenMenuCount.value = menuCount;
      childrenLinkCount.value = linkCount;
    }
  },
  { immediate: true, deep: true },
);

/**
 * 选择
 */
const handleSelect = (_item) => {
  singleSelectedStore.setSelectedMenu(_item);
};
</script>

<style scoped lang="scss">
.c__menu-item__inner {
  font-size: 12px;
  height: 60px;
}

.c_menu-children > * {
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: -24px;
    border-top: 1px dashed rgba(221, 221, 221, 0.4);
    top: 32px;
    width: 20px;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: -24px;
    border-left: 1px dashed rgba(221, 221, 221, 0.4);
    top: -4px;
    height: calc(100% + 6px);
    width: 32px;
  }

  &:last-child::after {
    height: 32px;
  }
}
// .c__menu-item {
//   font-size: 12px;
//   // margin-left: 32px;
//   &.show-l-line::after {
//     content: '';
//     display: block;
//     position: absolute;
//     left: 4px;
//     border-left: 1px dashed rgba(221, 221, 221, 0.4);
//     top: 64px;
//     bottom: 31px;
//     width: 32px;
//   }

//   &.is-child > .c__menu-item__inner {
//     &:after {
//       content: '';
//       display: block;
//       position: absolute;
//       left: -28px;
//       border-bottom: 1px dashed rgba(221, 221, 221, 0.4);
//       top: 50%;
//       width: 26px;
//     }
//   }
// }
</style>
