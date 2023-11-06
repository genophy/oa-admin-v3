<!--
  FileDesc  : CompEmployeePostEditor
  path      : src/views/pages/employee/components/CompEmployeePostEditor.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <!--  -->
  <div class="flex flex-col v-comp-employee-resume-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="岗位" prop="employeePostId">
          <el-select v-model="formField.employeePostId" placeholder="请选择岗位" filterable class="w-full">
            <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="简历文件" prop="resumeFileHex">
          <div>
            <FormFieldFileUploader v-model="formField.resumeFileHex" accept-type="application/pdf" />
            <div class="mt-2 text-xs text-orange-400">仅支持PDF文件</div>
          </div>
        </el-form-item>

        <div class="grid-cols-2 xl:grid">
          <div>
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="formField.name" placeholder="请输入名称" maxlength="32" class="w-full" clearable />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formField.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
                <el-radio :label="2">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <ElFormItem label="头像" prop="avatar">
            <BaseImageUploader v-model:single="formField.avatar" preview-able edit-able />
          </ElFormItem>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formField.age" placeholder="请输入年龄" maxlength="9" class="w-full" clearable> <template #append>岁</template></el-input>
          </el-form-item>
          <el-form-item label="工龄" prop="workYear">
            <el-input v-model.number="formField.workYear" placeholder="请输入工龄" maxlength="9" class="w-full" clearable>
              <template #append>年</template>
            </el-input>
          </el-form-item>
          <el-form-item label="学历" prop="academicType">
            <el-select v-model="formField.academicType" placeholder="请选择学历" filterable class="w-full">
              <el-option v-for="item in ACADEMIC_TYPE" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="学校" prop="school"> <el-input v-model.number="formField.school" placeholder="请输入学校" maxlength="9" class="w-full" clearable /> </el-form-item>
          <el-form-item label="手机号" prop="phone"> <el-input v-model.trim="formField.phone" placeholder="请输入手机号" maxlength="11" class="w-full" clearable /> </el-form-item>
          <el-form-item label="QQ号" prop="qq"> <el-input v-model.trim="formField.qq" placeholder="请输入QQ号" maxlength="20" class="w-full" clearable /> </el-form-item>
          <el-form-item label="微信号" prop="wechat">
            <el-input v-model.trim="formField.wechat" placeholder="请输入微信号" maxlength="50" class="w-full" clearable />
          </el-form-item>
        </div>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formField.address" type="textarea" placeholder="请输入地址" maxlength="200" :rows="4" resize="none" show-word-limit clearable />
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
import { EmployeePostController, ResumeController } from '/@/api';
import BaseImageUploader from '/@/components-base/BaseFile/BaseImageUploader.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import FormFieldFileUploader from '/@/components/FormField/FormFieldFileUploader.vue';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { ACADEMIC_TYPE } from '/@/libs/utils/constants';
import { toMillisecond } from '/@/libs/utils/dateUtil';
import { FormValidateUtil } from '/@/libs/utils/formValidateUtil';
import { assignObj } from '/@/libs/utils/langUtil';

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
  employeePostId: '',
  id: '',
  name: '',
  avatar: '',
  resumeFileHex: '',
  gender: '',
  age: '',
  workYear: '',
  academicType: '',
  school: '',
  phone: '',
  areacode: '',
  address: '',
  qq: '',
  wechat: '',
  imageHexes: '',
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
  return ResumeController.resumeUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddUser = async (params) => {
  return ResumeController.resumeAdd(params, 'message').then(() => {
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

  if (props.resumeInfo?.id) {
    assignObj(formField.value, props.resumeInfo, { employeePostId: (props.resumeInfo?.employeePost || {}).id, resumeFileHex: props.resumeInfo?.fileResume?.fileHex });
  }

  isLoaded.value = true;
});
</script>

<style scoped lang="scss"></style>
