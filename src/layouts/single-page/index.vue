<template>
  <!--  -->
  <!-- <RouterView v-slot="{ Component, route }">
    <KeepAlive v-if="openCache && !getMobileMode" :include="getCaches">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
    <component :is="Component" v-else :key="route.fullPath" />
  </RouterView> -->

  <RouterView>
    <template #default="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <div v-else :key="route.name as any" class="contents">
          <component :is="Component" :key="route.fullPath" />
        </div>
      </transition>
    </template>
  </RouterView>

  <FramePage v-if="getCanEmbedIFramePage" />
</template>

<script setup lang="ts">
import { computed, unref } from 'vue';
import FramePage from '../frame-page/index.vue';
import { useMultipleTabSetting } from '/@/libs/hooks/setting/useMultipleTabSetting';
import { useRootSetting } from '/@/libs/hooks/setting/useRootSetting';
import { useMultipleTabStore } from '/@/libs/store/modules/multipleTab';

const { getShowMultipleTab } = useMultipleTabSetting();

const tabStore = useMultipleTabStore();

const { getOpenKeepAlive, getCanEmbedIFramePage, getMobileMode } = useRootSetting();

const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab) && !unref(getMobileMode));

const getCaches = computed((): string[] => {
  if (!unref(getOpenKeepAlive)) {
    return [];
  }
  return tabStore.getCachedTabList;
});
</script>

<style scoped lang="scss">
@import '/@/design/transition/fade.scss';
</style>
