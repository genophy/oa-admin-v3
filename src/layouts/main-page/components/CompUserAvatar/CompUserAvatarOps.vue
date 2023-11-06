<template>
  <!--  -->

  <el-dropdown trigger="click" @command="handleCommand">
    <div class="cursor-pointer flex px-2 hover:bg-gray-200 dark:hover:bg-gray-700">
      <CompUserAvatar />
      <div class="flex px-1 items-center">
        <BaseIcon icon="ion-chevron-down" class="text-gray-400" />
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="modifyPassword">
          <BaseIcon icon="ion:key-outline" class="mr-4" />
          <span>修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item command="systemSetting">
          <BaseIcon icon="ion:construct-outline" class="mr-4" />
          <span>系统设置</span>
        </el-dropdown-item>
        <el-dropdown-item command="logout" divided>
          <BaseIcon icon="ion-exit-outline" class="mr-4" />
          <span>退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import CompUserAvatar from './index.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import CompSystemSetting from '/@/layouts/main-page/components/CompSystemSetting.vue';
import { useUserStore } from '/@/libs/store/modules/user';
import CompModifyPassword from '/@/views/account/components/CompModifyPassword.vue';

const userStore = useUserStore();
// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

/**
 * 修改当前密码
 */
const modifyPassword = () => {
  dynDialog.open(CompModifyPassword, {}, { title: '修改密码' });
};

/**
 * 系统设置
 */
const systemSetting = () => {
  dynDialog.open(CompSystemSetting, {}, { title: '系统设置' });
};

/**
 * 登出
 */
const logout = () => {
  userStore.confirmLoginOut();
};

/**
 * 命令触发
 * @param command
 */
const handleCommand = (command: string | number | object) => {
  switch (command) {
    case 'modifyPassword':
      modifyPassword();
      break;
    case 'systemSetting':
      systemSetting();
      break;
    case 'logout':
      logout();
      break;

    default:
      break;
  }
};
</script>

<style scoped lang="scss"></style>
