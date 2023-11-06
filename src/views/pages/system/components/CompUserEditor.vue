<template>
  <!--  -->
  <div class="flex flex-col c__user-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="登录账号" prop="account" class="w-full">
          <el-card v-if="userInfo && userInfo.id" shadow="never" class="w-full" :body-style="{ padding: '0 16px' }">{{ formField.account }}</el-card>
          <el-input v-else v-model.trim="formField.account" placeholder="请输入账号" maxlength="32" class="w-full" clearable />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formField.name" placeholder="请输入名称" maxlength="32" class="w-full" clearable />
        </el-form-item>

        <el-form-item label="身份证号" prop="idCardNumber">
          <el-input v-model.trim="formField.idCardNumber" placeholder="请输入身份证号" maxlength="32" class="w-full" clearable />
        </el-form-item>

        <ElFormItem label="头像" prop="avatar">
          <BaseImageUploader v-model:single="formField.avatar" preview-able edit-able />
        </ElFormItem>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="formField.phone" placeholder="请输入手机号" maxlength="11" class="w-full" clearable />
        </el-form-item>

        <el-form-item label="QQ号" prop="qq">
          <el-input v-model.trim="formField.qq" placeholder="请输入QQ号" maxlength="20" class="w-full" clearable />
        </el-form-item>

        <el-form-item label="微信号" prop="wechat">
          <el-input v-model.trim="formField.wechat" placeholder="请输入微信号" maxlength="50" class="w-full" clearable />
        </el-form-item>

        <template v-if="isLoaded">
          <el-form-item label="管理员" prop="admin">
            <ElSwitch v-model="formField.admin" :active-value="true" :inactive-value="false" />
          </el-form-item>

          <template v-if="!formField.admin">
            <el-form-item label="角色权限" prop="roleIds">
              <el-select v-model="formField.roleIds" placeholder="请选择角色权限" multiple class="w-full">
                <el-option v-for="item in remoteFullDataStore.getRoles" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-form-item label="所属部门" prop="departmentIds">
              <ElTreeSelect v-model="formField.departmentIds" :data="deptTree" multiple :render-after-expand="false" show-checkbox check-strictly check-on-click-node class="w-full" />
            </el-form-item>
            <el-form-item label="权限范围" prop="permissionScope">
              <el-radio-group v-model="formField.permissionScope">
                <el-radio v-for="item in USER_PERMISSION_SCOPE" :key="item.id" :label="item.id" border>{{ item.name }}</el-radio>
              </el-radio-group>
              <div class="mt-4 text-xs">
                <div> 仅当前部门：仅可管理当前部门成员</div>
                <div> 仅子部门：仅可管理子部门成员</div>
                <div> 包括子部门：可管理当前部门及子部门成员</div>
              </div>
            </el-form-item>
            <el-form-item label="账号有效期" prop="effectiveTimeStart">
              <BaseFormDateRangePicker v-model:start="formField.effectiveTimeStart" v-model:end="formField.effectiveTimeEnd" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
          </template>
        </template>
      </div>
      <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
        <el-button class="mr-6" @click="handleClose"> <BaseIcon icon="ion-close-circle-outline" /> 取消</el-button>
        <el-button type="primary" @click="handleSubmit(refForm)"> <BaseIcon icon="ion-checkmark" /> 提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElSwitch, ElTreeSelect, FormInstance, FormRules } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { UserController } from '/@/api';
import BaseImageUploader from '/@/components-base/BaseFile/BaseImageUploader.vue';
import BaseFormDateRangePicker from '/@/components-base/BaseFormItem/BaseFormDateRangePicker.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useRemoteFullDataStore } from '/@/libs/store/modules/remoteFullData';
import { dateUtil, toMillisecond } from '/@/libs/utils/dateUtil';
import { FormValidateUtil } from '/@/libs/utils/formValidateUtil';
import { assignObj, recurseDealTree } from '/@/libs/utils/langUtil';
import { USER_PERMISSION_SCOPE } from '/@/libs/utils/constants';

const remoteFullDataStore = useRemoteFullDataStore();
const { createConfirm, createNotification } = useMessage();

const isLoaded = ref(false);

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  resumeId: '', // 是否是通过简历添加进来
  id: '',
  account: '',
  name: '',
  nickName: '',
  avatar: '',
  phone: '',
  qq: '',
  wechat: '',
  idCardNumber: '',
  admin: false,
  effectiveTimeStart: '',
  effectiveTimeEnd: '',
  roleIds: [],
  departmentIds: [],
  permissionScope: 0,
} as any);

const formRules = reactive<FormRules>({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { validator: FormValidateUtil.email, trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { validator: FormValidateUtil.name, trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: FormValidateUtil.phone, trigger: 'blur' },
  ],
  idCardNumber: [{ validator: FormValidateUtil.idCard, trigger: 'blur' }],
  // deptIds: [{ required: true, message: '请选择部门', trigger: 'change' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
  permissionScope: [{ required: true, message: '请选择权限范围', trigger: 'change' }],
  effectiveTimeStart: [{ required: true, message: '请选择时间范围', trigger: 'change' }],
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
  return UserController.userUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddUser = async (params) => {
  return UserController.userAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(async () => {
  remoteFullDataStore.queryRoles();
  remoteFullDataStore.queryDeptTree();

  let userInfo: any = props.userInfo;
  if (props.userInfo?.id) {
    userInfo = await UserController.userInfo(props.userInfo.id);
  }
  assignObj(formField.value, userInfo, { roleIds: (props.userInfo?.roles || []).map((item) => item.id), departmentIds: (userInfo?.departments || []).map((item) => item.id) });
  // 若是新增
  if (!unref(formField).id) {
    formField.value.effectiveTimeStart = dateUtil().valueOf();
    formField.value.effectiveTimeEnd = dateUtil().add(50, 'year').valueOf();
  }

  isLoaded.value = true;
});
</script>

<style scoped lang="scss"></style>
