<template>
  <!--  -->
  <div v-loading="isQuerying" class="flex flex-col c__dept-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <el-empty v-if="!isAdd && (!dept || !dept.id)" description="未选择部门" />
      <template v-else>
        <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model.trim="formField.name" placeholder="请输入部门名称" maxlength="32" class="w-full" clearable />
          </el-form-item>
          <!-- 若不是顶级部门 -->

          <el-form-item label="父级部门" prop="parentId">
            <el-cascader
              v-model="formField.parentId"
              :options="deptTree as any"
              :props="{ label: 'name', value: 'id', checkStrictly: true, multiple: false, expandTrigger: 'hover', emitPath: false }"
              placeholder="请选择父级部门"
              class="w-full"
              clearable
            />
          </el-form-item>

          <el-form-item label="联系人" prop="contactIds">
            <el-select v-model="formField.contactIds" placeholder="请选择联系人" multiple class="w-full">
              <el-option v-for="item in allPermissionUsers" :key="item.id" :label="`${item.name}- ${item.phone}`" :value="item.id">{{ item.name }}-{{ item.phone }}</el-option>
            </el-select>
          </el-form-item>

          <!--  <el-form-item label="联系人" prop="contacts">
            <el-select v-mode="formField.contacts" placeholder="请选择联系人" multiple filterable class="w-full" clearable>
              <el-option v-for="item in allPermissionUsers" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="排序" prop="sorting">
            <BaseInputNumber v-model="formField.sorting" :precision="0" :min="1" :max="999" />
          </el-form-item>
        </div>
        <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
          <el-button v-if="delAble" type="danger" class="mr-6" @click="handleDel"> <BaseIcon icon="ion-trash" /> 删除</el-button>
          <el-button type="primary" @click="handleSubmit(refForm)"> <BaseIcon icon="ion-checkmark" /> 提交</el-button>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { computed, onMounted, reactive, ref, unref, watch } from 'vue';
import { DepartmentController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { FormValidateUtil } from '/@/libs/utils/formValidateUtil';
import { recurseDealTree } from '/@/libs/utils/langUtil';
import { propTypes } from '/@/libs/utils/propTypes';
import { assignObj } from '/@/libs/utils/langUtil';
import BaseInputNumber from '/@/components-base/BaseInput/BaseInputNumber.vue';
const remoteFullDataStore = useRemoteFullDataStore();
const { createConfirm, createNotification } = useMessage();

const props = defineProps({
  isAdd: propTypes.bool.def(false),
  dept: {
    type: Object,
    default: () => {},
  },
  delAble: propTypes.bool.def(false),
});

const isQuerying = ref(false);
const refForm = ref<FormInstance>();

const allPermissionUsers = ref([] as any);

const formField = ref({
  id: '',
  name: '',
  parentId: '',
  contactPersonName: '',
  contactPersonPhone: '',
  contactPersonAddress: '',
  contactIds: [],
  sorting: '',
} as any);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  contactPersonPhone: [{ validator: FormValidateUtil.phone }],
});

const emits = defineEmits(['ok', 'cancel']);

const deptTree = computed(() => {
  return recurseDealTree(remoteFullDataStore.getDeptTree, (item) => {
    if (item.id === props.dept.id) {
      item.disabled = true;
    }
    return item;
  });
});

/**
 * 删除部门
 */
const handleDel = () => {
  createConfirm('删除部门', `确定删除此部门${props.dept.title}?`, () => {
    return doDelDept(unref(formField));
  });
};

/**
 * 编辑
 */
const doEditDept = async (params) => {
  return DepartmentController.departmentUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    fetchDept();
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddDept = async (params) => {
  return DepartmentController.departmentAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    fetchDept();
    emits('ok', true);
  });
};

/**
 * 刪除
 */
const doDelDept = async (params) => {
  return DepartmentController.delete_department(params.id).then(() => {
    createNotification.success('刪除', '刪除成功');
    // 发送重新获取菜单
    fetchDept();
    emits('ok', true);
  });
};

/**
 * 查询部门
 */
const fetchDept = () => {
  isQuerying.value = true;
  return remoteFullDataStore.queryDeptTree('message').finally(() => {
    isQuerying.value = false;
  });
};

/**
 * 查询所有有权限的用户
 * @param departmentId
 */
const queryPermissionUsersById = async (departmentId) => {
  if (departmentId) {
    const res = await DepartmentController.departmentAllPermissionUsers(departmentId, {});
    allPermissionUsers.value = res;
  } else {
    allPermissionUsers.value = [];
  }
};

/**
 * 提交
 */
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        if (unref(formField).id) {
          // 编辑
          return doEditDept(unref(formField));
        } else {
          // 新增
          return doAddDept(unref(formField));
        }
      }).then((_action) => {});
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};

watch(
  () => props.dept,
  (v) => {
    let _dept: any = {};
    if (v) {
      _dept = cloneDeep(props.dept);
    }

    assignObj(formField.value, _dept, { contactIds: (_dept?.contacts || []).map((item) => item.id) });
    refForm?.value?.clearValidate();

    queryPermissionUsersById(_dept.id);
  },
  { immediate: true, deep: true },
);

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
