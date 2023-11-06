<!--
  FileDesc  : ImageDemo
  path      : src/views/demos/file-demo/ImageDemo.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-image-demo">
    <BaseImageUploader v-model:single="image1" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseImageUploader from '/@/components-base/BaseFile/BaseImageUploader.vue';

const image1 = ref('');
</script>

<style scoped lang="scss"></style>
