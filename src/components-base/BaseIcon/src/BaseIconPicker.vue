<template>
  <!--  -->
  <el-input :value="currentSelect" :style="{ width }" placeholder="选择图标" clearable @blur="handleChangeIpt">
    <template #prepend>
      <div>
        <BaseIcon :icon="currentSelect" />
      </div>
      <!-- <div class="opacity-0 w-0 pointer-events-none inline">{{ currentSelect }}</div> -->
    </template>

    <template #append>
      <el-popover :width="getMobileMode ? 280 : 560" trigger="click">
        <template #reference>
          <!-- <div class="iconify" :data-icon="value || 'ion:create-outline'"></div> -->
          <BaseIcon class="cursor-pointer" icon="ion:chevron-down" />
        </template>

        <div>
          <div class="flex mb-2 px-2 justify-end items-center">
            <div class="w-50">
              <el-input v-model="searchKey" placeholder="图标名" clearable />
            </div>
            <BaseIcon icon="ion:filter" class="ml-2" />
          </div>
          <BaseFullDataPagination :list="currentList">
            <template #default="{ list }">
              <div class="max-h-60 grid gap-0.5 grid-cols-5 overflow-auto lg:grid-cols-10">
                <div v-for="item in list" :key="item">
                  <el-button @click="hasSelectIcon(item)">
                    <BaseIcon :icon="item" />
                  </el-button>
                </div>
              </div>
            </template>
          </BaseFullDataPagination>
        </div>
      </el-popover>
      <!-- <span class="iconify" :data-icon="value || 'ion:create-outline'"></span> -->
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, unref, watch } from 'vue';
import BaseFullDataPagination from '../../BasePagination/BaseFullDataPagination.vue';
import iconsData from '../data/icons.data';
import BaseIcon from './BaseIcon.vue';
import { useAppStore } from '/@/libs/store/modules/app';
import { propTypes } from '/@/libs/utils/propTypes';

const instance = getCurrentInstance();

const getIcons = () => {
  const data = iconsData as any;
  const prefix: string = data?.prefix ?? '';
  let result: string[] = [];
  if (prefix) {
    result = (data?.icons ?? []).map((item) => `${prefix}:${item}`);
  } else if (Array.isArray(iconsData)) {
    result = iconsData as string[];
  }
  return result;
};

const props = defineProps({
  modelValue: propTypes.string.def(''),
  width: propTypes.string.def('100%'),
  pageSize: propTypes.number.def(140),
  copy: propTypes.bool.def(false),
  // icon color
  color: propTypes.string,
  // icon size
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 16,
  },
  mode: propTypes.oneOf<('svg' | 'iconify')[]>(['svg', 'iconify']).def('iconify'),
});
const emits = defineEmits(['update:modelValue', 'change']);

const appStore = useAppStore();
const currentSelect = ref('');

const icons = getIcons();
const searchKey = ref('');
const currentList = computed(() => {
  if (unref(searchKey)) {
    return unref(icons).filter((val) => ~val.indexOf(unref(searchKey)));
  } else {
    return unref(icons);
  }
});

const getMobileMode = computed(() => appStore.getMobileMode);
watch(
  () => props.modelValue,
  (v) => {
    currentSelect.value = v || '';
  },
  { immediate: true },
);

watch(
  () => currentSelect.value,
  (v) => {
    emits('update:modelValue', v);
    emits('change', v);
  },
);

const hasSelectIcon = (icon) => {
  currentSelect.value = icon;
  instance?.ctx?.$forceUpdate();
};

const handleChangeIpt = (e) => {
  console.log(e);
  currentSelect.value = e.target.value;
};

/**
 * 组件加载
 */
onMounted(() => {});
</script>

<style scoped lang="scss"></style>
