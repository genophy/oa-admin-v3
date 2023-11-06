<!--
  FileDesc  : CompSetInterviewResult
  path      : src/views/pages/employee/components/CompSetInterviewResult.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <!--  -->
  <div class="flex flex-col v-comp-set-interview-result relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="面试状态" prop="status">
          <el-radio-group v-model="formField.status">
            <el-radio :label="1">进行中</el-radio>
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formField.remark" type="textarea" placeholder="请输入备注" maxlength="200" :rows="4" resize="none" show-word-limit clearable />
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
import { cloneDeep } from 'lodash-es';
import { onMounted, reactive, ref, unref } from 'vue';
import { EmployeePostController, ResumeInterviewController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { FormValidateUtil } from '/@/libs/utils/formValidateUtil';
import { assignObj } from '/@/libs/utils/langUtil';

const { createConfirm, createNotification } = useMessage();

const isLoaded = ref(false);

const props = defineProps({
  interviewInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  id: '',
  status: '',
  remark: '',
} as any);

const formRules = reactive<FormRules>({
  employeePostId: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  phone: [{ validator: FormValidateUtil.phone, trigger: 'blur' }],
});

const postList = ref([] as any);

/**
 * 关闭当前弹框
 */
const handleClose = () => emits('cancel', false);

/**
 * 提交
 */
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        const params = cloneDeep(unref(formField));

        return doSetResult(params);
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
const doSetResult = async (params) => {
  return ResumeInterviewController.resumeInterviewUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 查询所哟岗位
 */
const queryAllPostList = async () => {
  const { list } = await EmployeePostController.employeePostListAll();
  postList.value = list;
};

onMounted(async () => {
  queryAllPostList();

  if (props.interviewInfo?.id) {
    assignObj(formField.value, props.interviewInfo);
  }

  isLoaded.value = true;
});
</script>

<style scoped lang="scss"></style>
