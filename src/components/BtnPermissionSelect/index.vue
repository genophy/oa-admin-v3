<!--
  FileDesc  :  
  path      : src/components/BtnPermissionSelect/index.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <el-select v-model="sCode" placeholder="选择按钮权限" filterable @change="handleChange">
    <el-option-group v-for="pItem in buttons" :key="pItem.name">
      <div class="text-xs px-4 text-gray-500">
        <span> {{ pItem.name }}</span> <span>{{ pItem.path }}</span>
      </div>
      <el-option v-for="item in pItem.children" :key="item.code" :label="`${item.name}:${item.code}`" :value="item.code">
        <div class="text-xs px-4 text-gray-500">
          <span> {{ item.name }}</span> <span>{{ item.code }}</span>
        </div>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script setup lang="ts">

import { find, flatten } from 'lodash-es';
import { ref, watch } from 'vue';

import { buttons } from './btn-data';
import { propTypes } from '/@/libs/utils/propTypes';

const buttonEles = flatten(buttons.map((item) => item.children));

const props = defineProps({
  title: propTypes.string.def(''),
  perms: propTypes.string.def(''),
});

const emits = defineEmits(['update:title', 'update:perms']);
const sCode = ref('');
// // const pages: any = ref([]);

watch(
  () => props.perms,
  (_perms) => (sCode.value = _perms),
  { immediate: true },
);

const handleChange = (_perms) => {
  emits('update:perms', _perms || '');
  const _title = (find(buttonEles, (bItem: any) => bItem.code === _perms) as any)?.name;
  emits('update:title', _title || '');
};
</script>

<style scoped lang="scss"></style>
