<template>
  <!--  -->
  <div class="h-full w-full">
    <iframe v-if="frameSrc2" ref="frameRef" :src="frameSrc2" class="h-full w-full" @load="hideLoading"></iframe>
  </div>
</template>

<script setup lang="ts">


import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { propTypes } from '/@/libs/utils/propTypes';

const route = useRoute();

const props = defineProps({
  frameSrc: propTypes.string.def(''),
});

const frameSrc2: any = computed(() => props.frameSrc || route.query?.src);

const loading = ref(true);

function hideLoading() {
  loading.value = false;
}
</script>

<style scoped lang="scss"></style>
