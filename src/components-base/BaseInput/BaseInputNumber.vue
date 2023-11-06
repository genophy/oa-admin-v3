<!--
  FileDesc  : BaseInputNumber
  path      : src/components-base/BaseInput/BaseInputNumber.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <el-input-number v-model="numVal" :step="step" :precision="precision" :step-strictly="stepStrictly" :size="size" :min="min" :max="max" @change="handleChangeVal" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  modelValue: propTypes.oneOfType([String, Number]).def(0),
  step: propTypes.number.def(1),
  stepStrictly: propTypes.bool.def(false),
  precision: propTypes.number.def(1),
  size: propTypes.oneOf<any[]>(['large', 'default', 'small']).def('default'),
  min: propTypes.number.def(0),
  max: propTypes.number.def(100),
});

const numVal = ref(0);

const emits = defineEmits(['update:modelValue', 'change']);

watch(
  () => props.modelValue,
  (v) => {
    numVal.value = Number(v) || 0; // Math.floor( * 100);
  },
  { immediate: true },
);

const handleChangeVal = (val) => {
  emits('update:modelValue', ((val || 0) / 100).toFixed(2));
  emits('change', ((val || 0) / 100).toFixed(2));
};
</script>

<style scoped lang="css"></style>
