<!--
  FileDesc  : BaseTooltip
  path      : src/components-base/BaseTooltip/BaseTooltip.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-base-tooltip">
    <ElTooltip ref="refTooltip" v-bind="$attrs" :effect="IsThemeDark ? 'dark' : 'light'">
      <slot> </slot>
    </ElTooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRootSetting } from '/@/libs/hooks/setting/useRootSetting';
const refTooltip = ref();
const { IsThemeDark } = useRootSetting();
</script>

<style scoped lang="scss"></style>
