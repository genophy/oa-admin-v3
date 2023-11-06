<template>
  <!--  -->
  <div class="v__login">
    <div class="flex p-8 top-0 right-0 fixed items-center justify-end">
      <CompToggleDarkMode />
      <BaseAppLocalePicker class="text-base w-30" />
    </div>
    <el-card class="transform top-1/2 left-1/2 w-80 z-10 -translate-x-1/2 -translate-y-1/2 fixed lg:left-3/4 lg:w-100">
      <section class="font-extrabold mb-4 tracking-widest text-2xl"> {{ t('field.upper.login') }}</section>
      <section>
        <el-form ref="refForm" :model="formField" :rules="formRules" @keypress.enter="handleSubmit(refForm)">
          <el-form-item prop="account">
            <el-input v-model="formField.account" size="large" :placeholder="t('field.account')" class="w-full" clearable />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="formField.password" size="large" type="password" :placeholder="t('field.password')" class="w-full" show-password clearable />
          </el-form-item>

          <el-form-item prop="validCode">
            <div class="flex w-full">
              <el-input v-model="formField.validCode" size="large" :placeholder="t('field.validCode')" maxlength="4" class="flex-grow" clearable />
              <img class="cursor-pointer object-fill bg-gray-100 flex-shrink-0 h-10 ml-4 w-25 active:opacity-80" :src="codeImgUrl" alt="验证码" @click="getCodeImgUrl" />
            </div>
          </el-form-item>
        </el-form>

        <div class="flex mt-4 justify-between">
          <el-checkbox v-model="isRememberMe">{{ t('field.rememberMe') }}</el-checkbox>

          <el-link type="primary" :underline="false">{{ t('field.forgetPassword') }}</el-link>
        </div>

        <div class="mt-10">
          <el-button type="primary" :loading="isSubmitting" :disabled="isSubmitting" size="large" class="w-full" @click="handleSubmit(refForm)">{{ t('field.upper.login') }}</el-button>
        </div>
      </section>
    </el-card>

    <!-- <div class="">
      <h1 class="font-extrabold m-12 text-shadow-xl tracking-widest text-4xl inline-block">
        {{ siteName }}
      </h1>
    </div> -->

    <img :src="imgBg2" alt="" class="h-full object-cover w-full top-0 left-0 -z-1 fixed" />
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
// import { isDevMode } from '/@/libs/utils/env';
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { AuthController } from '/@/api';
import defaultImgBg from '/@/assets/img/company01.jpg';
import CompToggleDarkMode from '/@/components-base/BaseApplication/src/BaseAppToggleDarkMode.vue';
import { BaseAppLocalePicker } from '/@/components-base/BaseApplication';
import { useI18n } from '/@/libs/hooks/web/useI18n';
import { useUserStore } from '/@/libs/store/modules/user';
import { useWebsiteConfigStore } from '/@/libs/store/modules/websiteConfig';
import { prefixImgUrl } from '/@/libs/utils/commons';
import ImageConvertUtil from '/@/libs/utils/imageConvertUtil';

const { t } = useI18n();

const websiteConfigStore = useWebsiteConfigStore();

const isSubmitting = ref(false);
const userStore = useUserStore();
const refForm = ref<FormInstance>();

const imgBg2 = computed(() => (websiteConfigStore.getWebsiteInfo?.loginBg ? prefixImgUrl(websiteConfigStore.getWebsiteInfo.loginBg) : defaultImgBg));

const formField = reactive({
  account: '',
  password: '',
  validCode: '',
});

const formRules = reactive<FormRules>({
  account: [{ required: true, message: t('field.account') + ' ' + t('field.beRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('field.password') + ' ' + t('field.beRequired'), trigger: 'blur' }],
  validCode: [{ required: true, message: t('field.validCode') + ' ' + t('field.beRequired'), trigger: 'blur' }],
});

const isRememberMe = ref(false);

const codeImgUrl = ref(); // ref(joinQueryParams(BaseSysLoginUrl.sysCode, { _t: Date.now() }, true));

// 图片验证码 id
let validImageId = '';

const { account, password } = userStore.getLoginCache;
if (account && password) {
  formField.account = account;
  formField.password = password;
  isRememberMe.value = true;
}

const getCodeImgUrl = async () => {
  AuthController.authValidImage({}, 'message', { responseType: 'arraybuffer' }, { isReturnNativeResponse: true } as any).then((res) => {
    const contentType = res.headers['content-type']; // image/jpeg
    validImageId = res.headers['valid-image-id'];
    const base64 = ImageConvertUtil.arrayBuffer2Base64(res.data, contentType);
    codeImgUrl.value = base64;
  });
  // codeImgUrl.value = `/oa-admin/auth/valid-image?t=${Date.now()}`; //joinQueryParams(BaseSysLoginUrl.sysCode, { _t: Date.now() }, true);
};

/**
 * 处理记住我
 */
const dealRememberMe = () => {
  // 缓存登录信息
  if (unref(isRememberMe)) {
    userStore.setLoginCache({
      account: formField.account,
      password: formField.password,
    });
  } else {
    userStore.setLoginCache(null);
  }
};

/**
 * 执行登录
 */
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      const params = Object.assign({}, formField, {
        // password: encryptByMd5(formField.password),
      });

      isSubmitting.value = true;
      userStore
        .login({
          ...params,
          validImageId,
          mode: 'message',
        })
        .catch((_error) => {
          getCodeImgUrl();
        })
        .finally(() => {
          dealRememberMe();
          isSubmitting.value = false;
        });

      console.log('submit suggest');
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};

onMounted(() => {
  getCodeImgUrl();
});
</script>

<style scoped lang="scss"></style>
