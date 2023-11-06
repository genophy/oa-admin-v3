<template>
  <!--  -->
  <svg :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']" class="inline-block" :fill="fill" :style="getStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
import { useDesign } from '/@/libs/hooks/web/useDesign';
import { propTypes } from '/@/libs/utils/propTypes';
/* ****************************************************************** */
/* props emits  ----------------------------------------------------- */
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  spin: {
    type: Boolean,
    default: false,
  },
  fill: propTypes.string.def(''),
});
const { prefixCls } = useDesign('svg-icon');
/* ****************************************************************** */
/* const let (use store) -------------------------------------------- */

/* ****************************************************************** */
/* compute watch subscribe ------------------------------------------ */

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
const getStyle = computed((): CSSProperties => {
  const { size } = props;
  let s = `${size}`;
  s = `${s.replace('px', '')}px`;
  return {
    width: s,
    height: s,
  };
});
/* ****************************************************************** */
/* method (handle public private) ----------------------------------- */

/* ****************************************************************** */
/* life cycle ------------------------------------------------------- */

/* ****************************************************************** */
/* expose ----------------------------------------------------------- */
</script>

<style scoped lang="scss"></style>
