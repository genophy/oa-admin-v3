<!--
  FileDesc  : index
  path      : src/components-base/BaseCard.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div :style="bodyStyle" class="border rounded p-4 relative" :class="{ 'ly-shadow': shadow === 'always', 'hover:ly-shadow': shadow === 'hover' }">
    <div class="flex flex-col h-full">
      <div class="flex-shrink-0">
        <slot name="header"></slot>
      </div>
      <div class="flex-grow">
        <slot></slot>
      </div>
      <div class="flex-shrink-0">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '/@/libs/utils/propTypes';

defineProps({
  bodyStyle: propTypes.object.def({}),
  shadow: propTypes.oneOf(['always', 'never', 'hover']).def('always'),
});
</script>

<style scoped lang="scss"></style>
