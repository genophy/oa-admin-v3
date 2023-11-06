<template>
  <!--  -->
  <div class="cursor-pointer flex h-full px-6 items-center hover:bg-gray-200 dark:hover:bg-gray-700" @click="handleViewLatestAnnouncement">
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
      <BaseIcon icon="ion:notifications-outline" :size="24" />
    </el-badge>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue';
import CompAnnouncementLatestViewer from './CompAnnouncementLatestViewer.vue';
import { AnnouncementController } from '/@/api';
import { BaseIcon } from '/@/components-base/BaseIcon';

const unreadCount = ref(0);

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

const handleViewLatestAnnouncement = () => {
  dynDialog.open(CompAnnouncementLatestViewer, {}, { title: '最近公告' }).then(() => {
    queryUnread();
  });
};

/**
 * 查询当前用户未读的公告数
 */
const queryUnread = async () => {
  const { count } = await AnnouncementController.announcementUnreadCount();
  unreadCount.value = count;
};

onMounted(() => {
  // 查询当前用户未读的公告数
  queryUnread();
});
</script>

<style scoped lang="scss"></style>
