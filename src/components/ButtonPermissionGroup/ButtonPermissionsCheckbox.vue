<!--
  FileDesc  : ButtonPermissionsCheckBox
  path      : src/components/ButtonPermissionGroup/ButtonPermissionsCheckbox.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <ElEmpty v-if="buttons.length === 0" description="暂无按钮权限" />
  <div class="grid grid-cols-2 v-button-permissions-checkbox">
    <div
      v-for="(item, idx) in buttons"
      :key="idx"
      class="rounded cursor-pointer m-2 text-center p-2 select-none ly-active btn-item ly-shadow"
      :class="{ 'text-white bg-green-500 dark:bg-green-800': !!~buttonPermissionArr.indexOf(item.code) }"
      @click="handleToggle(item)"
    >
      <div class="font-bold text-xs">{{ item.name }}</div>
      <div class="text-xs opacity-40"> {{ item.code }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { buttonsWithMenus } from './btn-data';
import { propTypes } from '/@/libs/utils/propTypes';
import { unref } from 'vue';

const props = defineProps({
  buttonPermissions: propTypes.string.def(''),
  menu: propTypes.object.def({}),
});

const buttons: any = ref([]);

const buttonPermissionArr = ref([] as any[]);

const emits = defineEmits(['permission-change']);

watch(
  () => props.menu,
  () => {
    buttons.value = (buttonsWithMenus.filter((item) => item.url === props.menu?.url) as any)[0]?.children || [];
    buttonPermissionArr.value = props.buttonPermissions.split(',');
  },
  {
    deep: true,
    immediate: true,
  },
);

/**
 * 切换
 * @param item
 */
const handleToggle = (item) => {
  const idx = unref(buttonPermissionArr).indexOf(item.code);
  if (~idx) {
    buttonPermissionArr.value.splice(idx, 1);
  } else {
    buttonPermissionArr.value.push(item.code);
  }
  emits(
    'permission-change',
    unref(buttonPermissionArr)
      .filter((v) => !!v)
      .join(','),
  );
};
</script>

<style scoped lang="scss"></style>
