<!--
  FileDesc  : CompEmployeeAssignInterview
  path      : src/views/pages/employee/components/CompEmployeeAssignInterview.vue
  Author    : genophy
  Version   :
  Usage     :
-->

<template>
  <!--  -->
  <div class="flex flex-col v-comp-employee-assign-interview relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="100px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="面试部门" prop="interviewDepartmentIds">
          <ElTreeSelect v-model="formField.interviewDepartmentIds" :data="deptTree" multiple :render-after-expand="false" show-checkbox check-strictly check-on-click-node class="w-full" />
        </el-form-item>

        <el-form-item label="面试时间" prop="interviewTime">
          <ElDatePicker v-model="formField.interviewTime" type="datetime" style="width: 100%" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" />
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
import { ElTreeSelect, FormInstance, FormRules } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { computed, onMounted, reactive, ref, unref } from 'vue';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { toMillisecond } from '/@/libs/utils/dateUtil';
import { assignObj, recurseDealTree } from '/@/libs/utils/langUtil';
import { ResumeController } from '/@/api';

const remoteFullDataStore = useRemoteFullDataStore();
const { createConfirm, createNotification } = useMessage();

const isLoaded = ref(false);

const props = defineProps({
  resumeInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  id: '',
  interviewDepartmentIds: [],
  interviewTime: '',
} as any);

const formRules = reactive<FormRules>({
  interviewDepartmentIds: [{ required: true, message: '请选择部门', trigger: 'change' }],
  interviewTime: [{ required: true, message: '请选择面试时间', trigger: 'change' }],
});

const deptTree = computed(() =>
  recurseDealTree(remoteFullDataStore.getDeptTree, (obj, _parent) => {
    return {
      value: obj.id,
      label: obj.name,
      children: obj.children,
    };
  }),
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
  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        const params = cloneDeep(unref(formField));
        params.interviewTime = toMillisecond(params.interviewTime, 'YYYY-MM-DD HH:mm:00');
        return doAssignInterview(params);
      }).then((_action) => {});
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};

/**
 * 执行安排面试
 * @param params 
 */
const doAssignInterview = async (params) => {
  return ResumeController.resumeAssignInterview(params).then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(async () => {
  remoteFullDataStore.queryDeptTree();

  assignObj(formField.value, props.resumeInfo);

  isLoaded.value = true;
});
</script>

<style scoped lang="scss"></style>
