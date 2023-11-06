<template>
  <!--  -->
  <div class="flex">
    <div class="flex items-center">
    
      <BaseImage :img-list="[userInfo.avatar]" prefix round :size="36" class="mr-2">
        <template #error>
          <div class="flex h-full justify-center items-center">
            <BaseIcon icon="ion:person-sharp" class="text-2xl text-gray-400" />
          </div>
        </template>
      </BaseImage>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="font-bold text-sm">{{ userInfo.account || '-' }}</div>
      <div v-if="userInfo.admin" class="text-xs transform text-orange-400 scale-80">管理员</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '/@/components-base/BaseIcon';
import BaseImage from '/@/components-base/BaseImage/BaseImage.vue';
import { useUserStore } from '/@/libs/store/modules/user';

const userStore = useUserStore();

const userInfo = userStore.getUserInfo;
</script>

<style scoped lang="scss"></style>
