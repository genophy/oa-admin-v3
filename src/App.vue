<template>
  <ElConfigProvider :locale="getElementLocale">
    <BaseAppProvider>
      <RouterView />
    </BaseAppProvider>
  </ElConfigProvider>
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import 'dayjs/locale/zh-cn';
import { ElConfigProvider } from 'element-plus';
import BaseAppProvider from '/@/components-base/BaseApplication/src/BaseAppProvider.vue';
import { useLocale } from '/@/libs/locales/useLocale';

// support Multi-language
const { getElementLocale } = useLocale();
</script>
<style scoped lang="scss"></style>
