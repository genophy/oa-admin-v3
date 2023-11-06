<template>
  <!--  -->
  <el-date-picker
    ref="refElDatePicker"
    v-model="timeArr"
    :type="type"
    range-separator="至"
    :placeholder="placeholder"
    :format="format"
    :value-format="valueFormat"
    :editable="false"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    @change="handleChange"
  />
</template>

<script setup lang="ts">


import { ref, watch } from 'vue';
import { toDateStr } from '/@/libs/utils/dateUtil';
import { propTypes } from '/@/libs/utils/propTypes';

const timeArr: any = ref([]);

const props = defineProps({
  start: propTypes.string.def(''),
  end: propTypes.string.def(''),
  type: propTypes.oneOf<any[]>(['daterange', 'datetimerange', 'monthrange']).def('daterange'),
  placeholder: propTypes.string.def('选择时间区间'),
  format: propTypes.string.def('YYYY-MM-DD'),
  valueFormat: propTypes.string.def('YYYY-MM-DD'),
});

const emits = defineEmits(['update:start', 'update:end']);

const refElDatePicker = ref();

watch(
  () => [props.start, props.end],
  ([v1, v2]) => {
    if (v1 && v2) timeArr.value = [toDateStr(v1, props.format), toDateStr(v2, props.format)];
    else timeArr.value = [];
  },
  { immediate: true },
);

const handleChange = (val) => {
  if (val && val[0] && val[1]) {
    emits('update:start', val[0]);
    emits('update:end', val[1]);
  } else {
    emits('update:start', '');
    emits('update:end', '');
  }
};
</script>

<style scoped lang="scss"></style>
