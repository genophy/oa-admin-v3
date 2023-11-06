<!--
  FileDesc  : BasePdfViewer
  path      : src/components-base/BaseDocViewer/BasePdfViewer.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="h-screen v-base-pdf-viewer">
    <iframe :src="url" style="width: 100%; height: 100%"></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { propTypes } from '/@/libs/utils/propTypes';
import { FileStoreUrl } from '/@/api/urls';

const props = defineProps({
  hex: propTypes.string.def(''),
});

const url = computed(() => {
  return `${FileStoreUrl.fileStorePdf}/${props.hex}`;
});
</script>

<style scoped lang="css"></style>
