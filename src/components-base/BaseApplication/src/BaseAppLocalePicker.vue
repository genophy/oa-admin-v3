<template>
  <BaseDropdown placement="bottom" :trigger="'click'" :dropMenuList="localeList" :selectedKeys="selectedKeys" overlayClassName="app-locale-picker-overlay" @menu-event="handleMenuEvent">
    <span class="cursor-pointer flex items-center">
      <BaseIcon icon="ion:language" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </BaseDropdown>
</template>
<script lang="ts" setup>
import { computed, ref, unref, watchEffect } from 'vue';
import { DropMenu } from '../../BaseDropdown/typing';
import type { LocaleType } from '/#/config';
import BaseDropdown from '/@/components-base/BaseDropdown/BaseDropdown.vue';
import { BaseIcon } from '/@/components-base/BaseIcon';
import { useLocale } from '/@/libs/locales/useLocale';
import { localeList } from '/@/libs/settings/localeSetting';

const props = defineProps({
  /**
   * Whether to display text
   */
  showText: { type: Boolean, default: true },
  /**
   * Whether to refresh the interface when changing
   */
  reload: { type: Boolean },
});

const selectedKeys = ref<string[]>([]);

const { changeLocale, getLocale } = useLocale();

const getLocaleText = computed(() => {
  const key = selectedKeys.value[0];
  if (!key) {
    return '';
  }
  return localeList.find((item) => item.event === key)?.text;
});

watchEffect(() => {
  selectedKeys.value = [unref(getLocale)];
});

async function toggleLocale(lang: LocaleType | string) {
  await changeLocale(lang as LocaleType);
  selectedKeys.value = [lang as string];
  props.reload && location.reload();
}

function handleMenuEvent(menu: DropMenu) {
  if (unref(getLocale) === menu.event) {
    return;
  }
  toggleLocale(menu.event as string);
}
</script>

<style lang="scss">
.app-locale-picker-overlay {
  .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
