<!--
  FileDesc  : CompAnnouncementDetail
  path      : src/layouts/main-page/components/CompAnnouncement/CompAnnouncementDetail.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="flex flex-col min-h-60 px-8 v-comp-announcement-detail">
    <div class="flex-shrink-0 text-center">
      <div class="font-bold text-2xl">{{ announcement.title }}</div>
      <div class="my-2 text-xs opacity-60">{{ toDateStr(announcement.createTime) || '-' }}</div>
    </div>
    <BaseCard class="flex-grow px-4 overflow-auto">
      <div class="whitespace-pre-wrap break-all"> {{ announcement.content }} </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue';
import { propTypes } from '/@/libs/utils/propTypes';
import { toDateStr } from '/@/libs/utils/dateUtil';
import { onMounted } from 'vue';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { AnnouncementController } from '/@/api';
import BaseCard from '/@/components-base/BaseCard.vue';

const remoteFullData = useRemoteFullDataStore();

const props = defineProps({
  info: propTypes.object.def({}),
});

const announcement = computed(() => props.info);
const allReadIds = computed(() => remoteFullData.getAnnouncementIdsRead);

onMounted(() => {
  if (!~unref(allReadIds).indexOf(unref(announcement).id)) {
    AnnouncementController.announcementUpdateRead({ ids: [unref(announcement).id] }).finally(() => {
      remoteFullData.queryAnnouncementIdsRead();
    });
  }
});
</script>

<style scoped lang="scss"></style>
