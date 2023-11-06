<template>

  <div class="flex px-2 items-center">
    <el-switch v-model="isDark" inline-prompt size="large" :active-icon="Moon" :inactive-icon="Sunny" :active-color="'#666666'" />
  </div>
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useDark } from '@vueuse/core';
import { APP_DARK_MODE_KEY_ } from '/@/libs/enums/cacheEnum';

const isDark = useDark({ storageKey: APP_DARK_MODE_KEY_, initialValue: 'light', valueDark: 'dark', valueLight: 'light' });

// const toggleDark = useToggle(isDark);
</script>

<style scoped lang="scss"></style>
