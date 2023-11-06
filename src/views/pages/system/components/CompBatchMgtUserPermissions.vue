<!--
  FileDesc  : CompBatchMgtUserPermissions
  path      : src/views/pages/system/components/CompBatchMgtUserPermissions.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-comp-batch-mgt-user-permissions">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="角色权限" prop="roleIds">
          <el-select v-model="formField.roleIds" placeholder="请选择角色权限" multiple class="w-full">
            <el-option v-for="item in remoteFullDataStore.getRoles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="departmentIds">
          <ElTreeSelect v-model="formField.departmentIds" :data="deptTree" multiple :render-after-expand="false" show-checkbox check-strictly check-on-click-node class="w-full" />
        </el-form-item>
        <el-form-item label="账号有效期" prop="effectiveTimeStart">
          <BaseFormDateRangePicker v-model:start="formField.effectiveTimeStart" v-model:end="formField.effectiveTimeEnd" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
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

import { assign } from 'lodash-es';
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { UserController } from '/@/api';
import BaseFormDateRangePicker from '/@/components-base/BaseFormItem/BaseFormDateRangePicker.vue';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { toMillisecond } from '/@/libs/utils/dateUtil';
import { recurseDealTree } from '/@/libs/utils/langUtil';
import { propTypes } from '/@/libs/utils/propTypes';

const remoteFullDataStore = useRemoteFullDataStore();
const { createConfirm, createNotification, createMessage } = useMessage();

const props = defineProps({
  userIds: propTypes.array.def([]),
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  roleIds: [],
  departmentIds: [],
  effectiveTimeStart: '',
  effectiveTimeEnd: '',
} as any);

const formRules = reactive<FormRules>({});

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
      const params = {} as any;

      if (unref(formField).effectiveTimeStart && unref(formField).effectiveTimeEnd) {
        params.effectiveTimeStart = toMillisecond(params.effectiveTimeStart, 'YYYY-MM-DD 00:00:00');
        params.effectiveTimeEnd = toMillisecond(params.effectiveTimeEnd, 'YYYY-MM-DD 23:59:59');
      }
      if (unref(formField).roleIds.length > 0) params.roleIds = unref(formField).roleIds;
      if (unref(formField).departmentIds.length > 0) params.departmentIds = unref(formField).departmentIds;

      if (Object.keys(params).length === 0) return createMessage.warning('请选择需要分配的权限');

      createConfirm('提交', `确定提交?`, () => {
        return doAssignPermissions(params);
      });
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};

/**
 * 分配权限
 */
const doAssignPermissions = async (params) => {
  return UserController.userBatchAssignPermissions(assign(params, { ids: props.userIds }), 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(async () => {
  remoteFullDataStore.queryRoles(); // 角色树
  remoteFullDataStore.queryDeptTree(); // 部门树
});
</script>

<style scoped lang="scss"></style>
