<template>
  <!--  -->
  <div class="flex flex-col c__announcement-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="formField.title" placeholder="请输入标题" maxlength="32" clearable />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input v-model="formField.content" type="textarea" placeholder="请输入内容" maxlength="2000" :rows="4" resize="none" show-word-limit clearable />
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
import { ElTree, FormInstance, FormRules } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { onMounted, reactive, ref, unref, watch } from 'vue';
import { AnnouncementController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { assignObj } from '/@/libs/utils/langUtil';
const { createConfirm, createNotification } = useMessage();

const props = defineProps({
  announcementInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const refTree = ref<InstanceType<typeof ElTree>>();

const formField = ref({
  id: '',
  title: '',
  content: '',
} as any);

const formRules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
});

watch(
  () => props.announcementInfo,
  (v) => {
    let _announcementInfo: any = {};
    if (v) {
      _announcementInfo = cloneDeep(v);
    }
    assignObj(formField.value, _announcementInfo);
  },
  { immediate: true, deep: true },
);

/**
 * 关闭当前弹框
 */
const handleClose = () => emits('cancel', false);
/**
 * 提交
 */
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  if (refTree.value) {
    formField.value.menuIds = unref(refTree)!.getCheckedKeys(); //.join(',');
  } else {
    formField.value.menuIds = []; // '';
  }

  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        if (unref(formField).id) {
          // 编辑
          return doEditAnnouncement(unref(formField));
        } else {
          // 新增
          return doAddAnnouncement(unref(formField));
        }
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
const doEditAnnouncement = async (params) => {
  return AnnouncementController.announcementUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddAnnouncement = async (params) => {
  return AnnouncementController.announcementAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
