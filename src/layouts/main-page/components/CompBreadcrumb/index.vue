<template>
  <!--  -->
  <el-breadcrumb v-if="breadCrumbList.length > 0">
    <el-breadcrumb-item v-for="item in breadCrumbList" :key="item.id">{{ item.name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { MenuItem } from '/#/store';
import { resolveMenuItemFromRoute } from '/@/libs/utils/menuUtil';

const route = useRoute();

const breadCrumbList: any = ref([]);
watchEffect(() => {
  const menu: Nullable<MenuItem> = resolveMenuItemFromRoute(route);
  if (!menu) {
    breadCrumbList.value.length = 0;
    return;
  }
  const res: any = [];
  (menu.parents || []).forEach((pItem) => {
    res.push(pItem);
  });
  if (menu) res.push(menu);
  breadCrumbList.value = res;
});
</script>

<style scoped lang="scss"></style>
