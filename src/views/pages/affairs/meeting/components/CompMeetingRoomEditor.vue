<!--
  FileDesc  : CompMeetingRoomEditor
  path      : src/views/pages/affairs/meetingRoom/components/CompMeetingRoomEditor.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <!--  -->
  <div class="flex flex-col v-comp-meeting-room-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formField.name" placeholder="请输入名称" maxlength="32" clearable />
        </el-form-item>
        <el-form-item label="房号" prop="roomNumber">
          <el-input v-model.trim="formField.roomNumber" placeholder="请输入房号" maxlength="32" clearable />
        </el-form-item>
        <el-form-item label="容纳人数" prop="maxPersonCount">
          <BaseInputNumber v-model="formField.maxPersonCount" :precision="0" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="配置介绍" prop="equipmentIntro">
          <el-input v-model="formField.equipmentIntro" type="textarea" placeholder="请输入配置介绍,如：投影仪，白板" maxlength="200" :rows="4" resize="none" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="房间地址" prop="address">
          <el-input v-model.trim="formField.address" placeholder="请输入房间地址" maxlength="200" clearable />
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
import { onMounted, reactive, ref, unref } from 'vue';
import { MeetingRoomController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { assignObj } from '/@/libs/utils/langUtil';
import BaseInputNumber from '/@/components-base/BaseInput/BaseInputNumber.vue';
const { createConfirm, createNotification } = useMessage();

const props = defineProps({
  meetingRoomInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  id: '',
  name: '',
  roomNumber: '',
  address: '',
  maxPersonCount: 1,
  equipmentIntro: '',
  remark: '',
} as any);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  roomNumber: [{ required: true, message: '请输入房号', trigger: 'blur' }],
  maxPersonCount: [{ required: true, message: '请输入容纳人数', trigger: 'blur' }],
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

  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        if (unref(formField).id) {
          // 编辑
          return doEditMeetingRoom(unref(formField));
        } else {
          // 新增
          return doAddMeetingRoom(unref(formField));
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
const doEditMeetingRoom = async (params) => {
  return MeetingRoomController.meetingRoomUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddMeetingRoom = async (params) => {
  return MeetingRoomController.meetingRoomAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(() => {
  assignObj(formField.value, props.meetingRoomInfo);
});
</script>

<style scoped lang="scss"></style>
