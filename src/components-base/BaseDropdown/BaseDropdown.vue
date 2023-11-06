<template>
  <!--  -->
  <el-dropdown @command="handleCommand">
    <span>
      <slot></slot>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="item in dropMenuList" :key="item.command">
          <el-dropdown-item :command="item.command">
            <BaseIcon v-if="item.icon" :icon="item.icon" />
            <span class="ml-1">{{ item.text }}</span>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { find } from 'lodash-es';
import type { DropdownItem } from './typing';
import BaseIcon from '../BaseIcon';

/* ****************************************************************** */
/* props emits  ----------------------------------------------------- */

const props = defineProps({
  popconfirm: {
    type: Boolean,
    default: false,
  },
  /**
   * 触发条件
   * @default ['hover'] hover/click/contextmenu
   * @type string
   */
  trigger: {
    type: String as PropType<'contextmenu' | 'click' | 'hover'>,
    default: 'hover',
  },
  // 下拉列表
  dropMenuList: {
    type: Array as PropType<(DropdownItem & Recordable)[]>,
    default: () => [],
  },
});

const emits = defineEmits(['menuEvent']);

/* ****************************************************************** */
/* const let (use store) -------------------------------------------- */

/* ****************************************************************** */
/* compute watch subscribe ------------------------------------------ */

/* ****************************************************************** */
/* method (handle public private) ----------------------------------- */

const handleCommand = (command: string | number) => {
  const menu = find(props.dropMenuList, (item) => item.command === command);
  if (menu) emits('menuEvent', menu);
};

/* ****************************************************************** */
/* life cycle ------------------------------------------------------- */

/* ****************************************************************** */
/* expose ----------------------------------------------------------- */
</script>

<style scoped lang="scss"></style>
