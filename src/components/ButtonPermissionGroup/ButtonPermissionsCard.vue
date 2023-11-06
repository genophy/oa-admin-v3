<!--
  FileDesc  : ButtonPermissionsCard
  path      : src/components/ButtonPermissionGroup/ButtonPermissionsCard.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div v-if="buttons.length > 0" class="v-button-permissions-card">
    <ElCard>
      <template #header>
        <div class="text-xs">按钮权限</div>
      </template>
      <div class="ly-grid:sm">
        <div v-for="(item, idx) in buttons" :key="idx" class="rounded m-2 text-center p-2 btn-item ly-shadow">
          <div class="font-bold text-xs">{{ item.name }}</div>
          <div class="text-xs opacity-40"> {{ item.code }}</div>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buttonsWithMenus } from './btn-data';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  title: propTypes.string.def('按钮权限'),
  menuUrl: propTypes.string.def(''),
});

const buttons = computed(() => {
  return (buttonsWithMenus.filter((item) => item.url === props.menuUrl) as any)[0]?.children || [];
});
</script>

<style scoped lang="scss"></style>
