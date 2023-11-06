<template>
  <!--  -->
  <div class="flex flex-col c__role-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formField.name" placeholder="请输入名称" maxlength="32" clearable />
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
import { ElTree, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref, unref } from 'vue';
import { MenuController, RoleController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { assignObj } from '/@/libs/utils/langUtil';
const { createConfirm, createNotification } = useMessage();

const props = defineProps({
  roleInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const refTree = ref<InstanceType<typeof ElTree>>();

const menus = ref([]);

const formField = ref({
  id: '',
  name: '',
  remark: '',
} as any);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  menuIds: [{ required: true, message: '请选择菜单', trigger: 'change' }],
});

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
          return doEditRole(unref(formField));
        } else {
          // 新增
          return doAddRole(unref(formField));
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
const doEditRole = async (params) => {
  return RoleController.roleUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddRole = async (params) => {
  return RoleController.roleAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 查询菜单
 */
const fetchMenu = () => {
  return MenuController.menuTreeAll({}, 'message').then((treeData) => {
    menus.value = treeData;
  });
};

onMounted(() => {
  assignObj(formField.value, props.roleInfo);
  fetchMenu();
});
</script>

<style scoped lang="scss"></style>
