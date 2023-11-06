<template>
  <!--  -->

  <el-sub-menu v-if="menu.type === 'FOLDER' && menu.children && menu.children[0]" :index="`${menu.id}`">
    <template #title>
      <div v-if="showIcon" class="mr-2 text-base inline-block">
        <BaseIcon v-if="menu.icon" :icon="menu.icon" :size="16" />
        <BaseIcon v-else icon="ion-folder-outline" />
      </div>
      <span v-if="menu.name">{{ menu.name }}</span>
    </template>

    <CompMenusSubItem v-for="item2 in menu.children" :key="item2.id" :menu="item2" :show-icon="showIcon" />
  </el-sub-menu>
  <el-menu-item v-else :index="`${menu.id}`">
    <div v-if="showIcon" class="mr-2 text-base inline-block">
      <BaseIcon v-if="menu.icon" :icon="menu.icon" :size="16" />
      <BaseIcon v-else-if="menu.type === 'FOLDER'" icon="ion-folder-outline" />
      <BaseIcon v-else-if="menu.type === 'ROUTE'" icon="ion-menu" />
      <BaseIcon v-else-if="menu.type === 'REDIRECT'" icon="ion-link" />
      <BaseIcon v-else icon="ion-browsers-outline" />
    </div>
    {{ menu.name }}
  </el-menu-item>
</template>

<script setup lang="ts">
import { propTypes } from '/@/libs/utils/propTypes';
import BaseIcon from '/@/components-base/BaseIcon';

defineProps({
  menu: propTypes.object,
  showIcon: propTypes.bool.def(true),
});
</script>

<style scoped lang="scss"></style>
