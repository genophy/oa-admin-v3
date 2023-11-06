<!--
  FileDesc  : BaseSealStatus 状态印章
  path      : src/components-base/BaseSeal/BaseSealStatus.vue
  Author    : genophy (2023-04-01 06:23)
  Version   :
  Usage     :
-->
<template>
  <div class="v-base-seal-status">
    <template v-for="item in compList" :key="item.id">
      <div v-if="`${item.id}` === `${current}`" class="border h-8 text-center text-base leading-8 v-base-seal-status" :style="{ color: item.color, borderColor: item.color }">
        {{ item.text }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  current: propTypes.any.def(''),
  list: propTypes.array.def([]),
});

const compList = ref([
  { id: 0, text: '未开始', color: '#929292' },
  { id: 1, text: '进行中', color: '#0096FF' },
  { id: 2, text: '通过', color: '#008F00' },
  { id: 3, text: '失败', color: '#FF7E79' },
] as any);

watch(
  () => props.list,
  (l) => {
    compList.value = l || [];
  },
  {
    immediate: true,
  },
);
</script>

<style scoped lang="css"></style>
