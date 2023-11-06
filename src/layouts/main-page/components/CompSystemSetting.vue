<template>
  <!--  -->
  <div v-loading="queryStatus === queryStatusEnum.querying" class="flex flex-col v__system-config relative">
    <ElForm ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="140px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-8 pl-4 overflow-auto">
        <ElFormItem label="网站名称" prop="siteName">
          <ElInput v-model.trim="formField.siteName" placeholder="请输入网站名称" maxlength="32" clearable />
        </ElFormItem>
        <ElFormItem label="网站描述">
          <ElInput v-model.trim="formField.siteDesc" type="textarea" placeholder="请输入网站描述" :rows="4" resize="none" clearable />
        </ElFormItem>
        <ElFormItem label="默认密码" prop="userDefaultPassword">
          <template #label>
            <div class="flex items-center">
              默认密码
              <!-- <ElTooltip content="新用户默认密码" placement="top" effect="dark">
                <BaseIcon icon="ion:information-circle-outline" :size="20" class="ml-2" />
              </ElTooltip> -->

              <BaseTooltip content="新用户默认密码" placement="top">
                <BaseIcon icon="ion:information-circle-outline" :size="20" class="ml-2" />
              </BaseTooltip>
            </div>
          </template>
          <ElInput v-model="formField.userDefaultPassword" type="password" placeholder="请输入默认密码" maxlength="32" show-password clearable />
        </ElFormItem>

        <ElFormItem label="网站icon" prop="siteIcon">
          <BaseImageUploader v-model:single="formField.siteIcon" preview-able edit-able />
        </ElFormItem>

        <ElFormItem label="网站logo" prop="siteLogo">
          <BaseImageUploader v-model:single="formField.siteLogo" preview-able edit-able />
        </ElFormItem>

        <ElFormItem label="登录页背景" prop="loginBg">
          <BaseImageUploader v-model:single="formField.loginBg" preview-able edit-able />
        </ElFormItem>

        <ElFormItem label="版本号" prop="version">
          <ElInput v-model.trim="formField.version" placeholder="请输入版本号" maxlength="32" clearable />
        </ElFormItem>
        <ElFormItem label="灰色模式" prop="grayMode">
          <ElSwitch v-model="formField.grayMode" :active-value="true" :inactive-value="false" />
        </ElFormItem>
      </div>
      <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
        <ElButton type="default" @click="loadTemplateConfig()"> <BaseIcon icon="ion:refresh" /> 默认配置</ElButton>
        <ElButton type="primary" @click="handleSubmit(refForm)"> <BaseIcon icon="ion-checkmark" /> 提交</ElButton>
      </div>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { Ref, onMounted, reactive, ref, unref } from 'vue';
import { WebsiteConfigController } from '/@/api';
import BaseImageUploader from '/@/components-base/BaseFile/BaseImageUploader.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';

import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useWebsiteConfigStore } from '/@/libs/store/modules/websiteConfig';
import { assignObj } from '/@/libs/utils/langUtil';
import BaseTooltip from '/@/components-base/BaseTooltip/BaseTooltip.vue';

const { createConfirm, createNotification } = useMessage();

const websiteConfigStore = useWebsiteConfigStore();

const refForm = ref<FormInstance>();
// const refBgImgs = ref();
// const refLogoImgs = ref();

// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);

const formField = ref({
  siteName: '',
  siteDesc: '',
  siteIcon: '',
  siteLogo: '',
  loginBg: '',
  userDefaultPassword: '',
  grayMode: false,
  version: '',
} as any);

const formRules = reactive<FormRules>({
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  userDefaultPassword: [
    { required: true, message: '请输入用户默认密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
});

const emits = defineEmits(['ok', 'cancel']);

/**
 * 加载默认数据
 */
const loadTemplateConfig = async () => {
  if (queryStatus.value === queryStatusEnum.querying) return;
  queryStatus.value = queryStatusEnum.querying;

  try {
    const { config } = await WebsiteConfigController.websiteConfigLoadTemplate();
    assignObj(formField.value, config);
  } catch (error) {
    console.error(error);
  }

  queryStatus.value = queryStatusEnum.finish;
};

/**
 * 提交
 */
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        return doEditConfig(unref(formField));
      }).then((_action) => {});
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};

/**
 * 编辑
 */
const doEditConfig = async (params) => {
  return websiteConfigStore.saveWebsiteInfo(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok');
  });
};

/**
 *  获取配置
 */
const fetchSysConfig = async () => {
  if (queryStatus.value === queryStatusEnum.querying) return;
  queryStatus.value = queryStatusEnum.querying;

  try {
    const configJson = await websiteConfigStore.queryWebsiteInfo();

    // configJson.bgImg && refBgImgs.value?.setImgIds([configJson.bgImg]);
    // configJson.logoImg && refLogoImgs.value?.setImgIds([configJson.logoImg]);
    assignObj(formField.value, configJson);
  } catch (error) {
    console.error(error);
  }

  queryStatus.value = queryStatusEnum.finish;
};

onMounted(() => {
  fetchSysConfig();
});
</script>

<style scoped lang="scss"></style>
