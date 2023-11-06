<template>
  <!-- 头部header -->

  <!-- 项目图片，项目名称 ，SPACE， 提醒，深色模式， 用户头像-用户名称(设置) -->
  <div class="flex">
    <div v-if="getMobileMode" class="flex flex-shrink-0 mr-4">
      <CompMenusDrawer />
      <!-- <CompMenusForDrop /> -->
    </div>

    <div class="flex flex-shrink-0 items-center">
      <img :src="logoImg" alt="" class="h-12 w-12" />
      <div>
        <div class="font-extrabold px-4 text-2xl text-blue-600 hidden sm:block dark:text-white">
          {{ websiteInfo.siteName }}
        </div>
        <div class="font-extrabold text-xs px-4 text-blue-400 hidden sm:block dark:text-white">
          {{ websiteInfo.siteDesc }}
        </div>
      </div>
    </div>

    <div class="flex-1"></div>
    <div class="flex flex-shrink-0">
      <CompAnnouncementIcon v-if="!getMobileMode" />
      <CompToggleDarkMode />
      <CompUserAvatarOps v-if="!getMobileMode" />
    </div>
  </div>
</template>

<script setup lang="ts">
/* ****************************************************************** */
/* props emits  ----------------------------------------------------- */

import { computed } from 'vue';
import CompToggleDarkMode from '/@/components-base/BaseApplication/src/BaseAppToggleDarkMode.vue';
import CompMenusDrawer from './CompMenus/CompMenusDrawer.vue';
import CompAnnouncementIcon from './CompAnnouncement/CompAnnouncementIcon.vue';
import CompUserAvatarOps from './CompUserAvatar/CompUserAvatarOps.vue';
import { useAppStore } from '/@/libs/store/modules/app';
import { useWebsiteConfigStore } from '/@/libs/store/modules/websiteConfig';

const appStore = useAppStore();

// 网站信息
const websiteConfigStore = useWebsiteConfigStore();

const getMobileMode = computed(() => appStore.getMobileMode);

const logoImg = computed(() => websiteConfigStore.getLogoFullUrl);
const websiteInfo = computed(() => websiteConfigStore.getWebsiteInfo);

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
</script>

<style scoped lang="scss"></style>
