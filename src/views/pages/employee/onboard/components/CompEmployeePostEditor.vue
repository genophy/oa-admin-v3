<!--
  FileDesc  : CompEmployeePostEditor
  path      : src/views/pages/employee/components/CompEmployeePostEditor.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <!--  -->
  <div class="flex flex-col v-comp-employee-post-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formField.name" placeholder="请输入名称" maxlength="32" class="w-full" clearable />
        </el-form-item>

        <el-form-item label="涉及部门" prop="departmentIds">
          <ElTreeSelect v-model="formField.departmentIds" :data="deptTree" multiple :render-after-expand="false" show-checkbox check-strictly check-on-click-node class="w-full" />
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
import { ElTreeSelect, FormInstance, FormRules } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { EmployeePostController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { toMillisecond } from '/@/libs/utils/dateUtil';
import { assignObj, recurseDealTree } from '/@/libs/utils/langUtil';

const remoteFullDataStore = useRemoteFullDataStore();
const { createConfirm, createNotification } = useMessage();

const isLoaded = ref(false);

const props = defineProps({
  postInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  id: '',
  name: '',
  departmentIds: [],
  remark: '',
} as any);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
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

        params.effectiveTimeStart = toMillisecond(params.effectiveTimeStart, 'YYYY-MM-DD 00:00:00');
        params.effectiveTimeEnd = toMillisecond(params.effectiveTimeEnd, 'YYYY-MM-DD 23:59:59');

        if (params.id) {
          // 编辑
          return doEditUser(params);
        } else {
          // 新增
          return doAddUser(params);
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
const doEditUser = async (params) => {
  return EmployeePostController.employeePostUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddUser = async (params) => {
  return EmployeePostController.employeePostAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(async () => {
  remoteFullDataStore.queryDeptTree();
  if (props.postInfo?.id) {
    assignObj(formField.value, props.postInfo, { departmentIds: (props.postInfo?.departments || []).map((item) => item.id) });
  }

  isLoaded.value = true;
});
</script>

<style scoped lang="scss"></style>
