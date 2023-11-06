<!--
  FileDesc  : CompAnnouncementLatestViewer
  path      : src/layouts/main-page/components/CompAnnouncement/CompAnnouncementLatestViewer.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="flex flex-col v-comp-announcement-latest-viewer">
    <div class="flex-grow px-4 overflow-auto">
      <BaseCard v-for="item in announcements" :key="item.id" class="m-4 ly-btn select-none relative" @click="handleViewDetail(item)">
        <template #header>
          <div class="flex justify-between items-end">
            <span class="font-bold text-lg">{{ item.title || '-' }}</span>
            <span class="text-xs text-gray-400">{{ toDateStr(item.createTime) || '-' }}</span>
          </div>
        </template>
        <div class="mt-2 text-xs truncate">
          {{ item.content }}
        </div>
        <span v-show="!~allReadIds.indexOf(item.id)" class="un-read"></span>
      </BaseCard>
    </div>
    <div class="border-t flex border-gray-200 px-4 pt-2 dark:border-gray-700">
      <ElButton size="large" type="primary" class="flex-grow" text @click="handleViewAll">查看所有</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import CompAnnouncementDetail from './CompAnnouncementDetail.vue';
import CompAnnouncementList from './CompAnnouncementList.vue';
import { AnnouncementController } from '/@/api';
import { AnnouncementUpdateDto } from '/@/api/dtos';
import BaseCard from '/@/components-base/BaseCard.vue';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { toDateStr } from '/@/libs/utils/dateUtil';

const remoteFullData = useRemoteFullDataStore();
// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

const allReadIds = computed(() => remoteFullData.getAnnouncementIdsRead);

const announcements = ref([] as AnnouncementUpdateDto[]);

const emits = defineEmits(['cancel']);

const queryLatestAnnouncements = async () => {
  const { list } = await AnnouncementController.announcementList({ pageSize: 5, order: { createTime: 'DESC' } });
  announcements.value = list.slice(0, 3);
};

/**
 * 查看所有
 */
const handleViewAll = () => {
  dynDialog.open(CompAnnouncementList, {}, { title: '公告', width: '80%' });
  emits('cancel');
};

/**
 * 查看详情
 */
const handleViewDetail = (item) => {
  dynDialog.open(CompAnnouncementDetail, { info: item }, { title: '公告详情' });
};

onMounted(() => {
  queryLatestAnnouncements();
});
</script>

<style scoped lang="scss">
.un-read {
  position: absolute;
  top: 0;
  right: 0;

  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: var(--el-color-danger);
    margin: 4px;
  }
}
</style>
