<template>
  <!--  -->
  <div class="c__dept-item relative" :class="{ 'show-l-line': dept.children.length > 0, 'is-child': isChild }" :data-title="dept.title">
    <div
      :class="{ 'text-blue-500': currentDept?.id === dept.id }"
      class="border cursor-pointer p-2 c__dept-item__inner relative hover:bg-blue-50 active:opacity-80 dark:hover:bg-light-blue-900"
      @click="handleSelect(dept)"
    >
      <div class="flex mb-1 justify-between">
        <div class="flex items-center">
          <div class="mx-2 text-base opacity-60">
            <BaseIcon icon="ion:people-outline" />
          </div>
          {{ dept.name }}
        </div>
        <div class="flex flex-shrink-0 text-xs opacity-40 items-center">
          <BaseIcon icon="ion-swap-vertical" class="mx-2" />
          {{ dept.sorting || '-' }}
        </div>
      </div>
      <div class="mx-2 text-xs text-gray-500">
        <div class="mb-1 grid grid-cols-2">
          <div>
            <span class="mr-2">联系人</span>
            <span>{{ dept.contactPersonName || '-' }}</span>
          </div>
          <div>
            <span class="mr-2">联系人电话</span>
            <span>{{ dept.contactPersonPhone || '-' }}</span>
          </div>
        </div>
        <div>
          <span class="mr-2">联系人地址</span>
          <span>{{ dept.contactPersonAddress || '-' }}</span>
        </div>
      </div>
    </div>

    <div v-if="dept.children.length > 0" class="pt-2 pl-8">
      <CompDeptItem v-for="item in dept.children" :key="item.id" :dept="item" :is-child="true" class="mb-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSingleSelectedStore } from '/@/libs/store/modules/singleSelected';
import { propTypes } from '/@/libs/utils/propTypes';
import BaseIcon from '/@/components-base/BaseIcon';

defineProps({
  // title, icon,children,
  dept: propTypes.object.def({}),
  isChild: propTypes.bool.def(false),
});

const singleSelectedStore = useSingleSelectedStore();

const currentDept = computed(() => singleSelectedStore.getSelectedDept);

/**
 * 选择
 */
const handleSelect = (_item) => {
  singleSelectedStore.setSelectedDept(_item);
};
</script>

<style scoped lang="scss">
.c__dept-item {
  // margin-left: 32px;
  &.show-l-line::after {
    content: '';
    display: block;
    position: absolute;
    left: 4px;
    border-left: 1px dashed rgba(221, 221, 221, 0.4);
    top: 84px;
    bottom: 41px;
    width: 32px;
  }

  &.is-child > .c__dept-item__inner {
    &:after {
      content: '';
      display: block;
      position: absolute;
      left: -28px;
      border-bottom: 1px dashed rgba(221, 221, 221, 0.4);
      top: 50%;
      width: 26px;
    }
  }
}
</style>
