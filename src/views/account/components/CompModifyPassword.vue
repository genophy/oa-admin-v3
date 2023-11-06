<!--
  FileDesc  : CompModifyPassword
  path      : src/views/account/components/CompModifyPassword.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-comp-modify-password relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="100px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="账号" prop="name">
          <el-card v-if="useInfo && useInfo.id" shadow="never" class="w-full" :body-style="{ padding: '0 16px' }">{{ useInfo.account }}</el-card>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formField.password" size="large" type="password" :placeholder="t('field.password')" class="w-full" show-password clearable />
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input v-model="formField.newPassword" size="large" type="password" :placeholder="t('field.newPassword')" class="w-full" show-password clearable />
        </el-form-item>
      </div>
      <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
        <el-button class="mr-6" @click="handleClose"> <BaseIcon icon="ion-close-circle-outline" /> 取消</el-button>
        <el-button type="primary" @click="handleSubmit(refForm)"> <BaseIcon icon="ion-checkmark" /> 提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '/@/libs/store/modules/user';
import { FormValidateUtil } from '/@/libs/utils/formValidateUtil';
import { AuthController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';

const refForm = ref();
const { getUserInfo: useInfo } = useUserStore();
const { t } = useI18n();

const formField = ref({
  password: '',
  newPassword: '',
} as any);

const emits = defineEmits(['ok', 'cancel']);

const formRules = reactive<FormRules>({
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { validator: FormValidateUtil.password2of2(unref(refForm), 'password') }],
});

const handleClose = () => {
  emits('cancel', false);
};

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid, fields) => {
    if (valid) {
      AuthController.authModifyPassword({ password: unref(formField).password, newPassword: unref(formField).newPassword }, 'message').then(() => {
        emits('ok');
      });
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};
</script>

<style scoped lang="scss"></style>
