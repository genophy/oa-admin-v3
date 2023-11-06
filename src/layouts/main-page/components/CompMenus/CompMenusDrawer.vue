<template>
  <!--  -->
  <div class="h-full flex-1 select-none">
    <div class="cursor-pointer flex h-full text-blue-500 w-12 items-center justify-center active:opacity-80" @click="showMenuDrawer = true">
      <BaseIcon icon="ion:menu" :size="24" />
    </div>

    <el-drawer v-model="showMenuDrawer" :size="getDrawerWidth" direction="ltr">
      <template #header>
        <CompUserAvatar />
      </template>

      <CompMenus :search-able="false" @select="showMenuDrawer = false" />
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="flex">
            <ElButton type="default" @click="modifyPassword"><BaseIcon icon="ion:key-outline" class="mr-2" />密码</ElButton>
            <ElButton type="warning" @click="systemSetting"><BaseIcon icon="ion:construct-outline" class="mr-2" />设置</ElButton>
          </div>
          <el-button type="danger" @click="logout"> 登出 <BaseIcon icon="ion:exit-outline" class="ml-2" /></el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue';
import CompUserAvatar from '../CompUserAvatar/index.vue';
import CompMenus from './index.vue';
import BaseIcon from '/@/components-base/BaseIcon/src/BaseIcon.vue';
import CompSystemSetting from '/@/layouts/main-page/components/CompSystemSetting.vue';
import { useAppStore } from '/@/libs/store/modules/app';
import { useUserStore } from '/@/libs/store/modules/user';
import CompModifyPassword from '/@/views/account/components/CompModifyPassword.vue';

const appStore = useAppStore();

const showMenuDrawer = ref(false);
const getDrawerWidth = computed(() => appStore.getDrawerWidth);

const userStore = useUserStore();

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

/**
 * 修改当前密码
 */
const modifyPassword = () => {
  dynDialog.open(CompModifyPassword, {}, { title: '修改密码' }).then(({ type }) => {
    if (type === 'ok') showMenuDrawer.value = false;
  });
};

/**
 * 系统设置
 */
const systemSetting = () => {
  dynDialog.open(CompSystemSetting, {}, { title: '系统设置' }).then(({ type }) => {
    if (type === 'ok') showMenuDrawer.value = false;
  });
};

const logout = () => {
  userStore.confirmLoginOut().then((type) => {
    if (type === 'ok') showMenuDrawer.value = false;
  });
};
</script>

<style scoped lang="scss"></style>
