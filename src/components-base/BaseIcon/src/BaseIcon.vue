<template>
  <!--  -->
  <Icon :class="[$attrs.class, 'iconify', icon, spin && 'app-iconify-spin']" :icon="icon" :style="getSize" style="display: inline-block;" />
</template>

<script setup lang="ts">
/* ****************************************************************** */
/* props emits  ----------------------------------------------------- */
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { isNumber, isString } from '/@/libs/utils/is';
import { propTypes } from '/@/libs/utils/propTypes';

const props = defineProps({
  // icon name
  icon: propTypes.string.def(''),
  spin: propTypes.bool.def(false),
  size: propTypes.any.def(16),
});

/* ****************************************************************** */
/* const let (use store) -------------------------------------------- */

/* ****************************************************************** */
/* compute watch subscribe ------------------------------------------ */

/* ****************************************************************** */
/* method (handle public private) ----------------------------------- */

/* ****************************************************************** */
/* life cycle ------------------------------------------------------- */

/* ****************************************************************** */
/* expose ----------------------------------------------------------- */

const getSize = computed(() => {
  if (isString(props.size)) {
    return { width: props.size, height: props.size, fontSize: props.size };
  } else if (isNumber(props.size)) {
    return { width: `${props.size}px`, height: `${props.size}px`, fontSize: `${props.size}px` };
  }
  return { width: '16px', size: '16px', fontSize: '16px' };
});
</script>

<style scoped lang="scss">
.app-iconify {
  display: inline-block;
  // vertical-align: middle;

  &-spin {
    svg {
      animation: loadingCircle 1s infinite linear;
    }
  }
}

.iconify {
  display: block;
  min-width: 1em;
  min-height: 1em;
}
</style>
