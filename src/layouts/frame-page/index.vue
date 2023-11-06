<template>
  <div v-if="showFrame">
    <template v-for="frame in getFramePages" :key="frame.path">
      <Iframe
        v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
        v-show="showIframe(frame)"
        :frameSrc="frame.meta.frameSrc"
      />
    </template>
  </div>
</template>

<script setup lang="ts">


import { computed, unref } from 'vue';
import { useFrameKeepAlive } from './useFrameKeepAlive';
import Iframe from '/@/views/sys/iframe/index.vue';

const { getFramePages, hasRenderFrame, showIframe } = useFrameKeepAlive();

const showFrame = computed(() => unref(getFramePages).length > 0);
</script>

<style scoped lang="scss"></style>
