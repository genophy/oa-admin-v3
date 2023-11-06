<!--
  FileDesc  : CompMeetingAppointment 预约会议
  path      : src/views/pages/affairs/meeting/components/CompMeetingAppointment.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="flex flex-col v-comp-meeting-appointment">
    <div class="flex-grow px-4">
      <div class="flex">
        <div class="flex flex-col flex-shrink-0 text-center px-4 justify-center">
          <div class="font-bold text-base mb-2">03-20</div>
          <div class="text-xs">周三</div>
        </div>
        <div class="border-l px-4 pb-2 overflow-hidden">
          <div class="mb-2">
            <BaseIcon icon="ion:logo-windows" class="mr-2" />
            <span class="font-extrabold text-base">{{ meetingRoom.name }}</span>
          </div>
          <div class="text-xs leading-6">
            <div class="flex">
              <span class="flex-1">房号：{{ meetingRoom.roomNumber || '-' }}</span>
              <span class="flex-1">容纳人数：{{ meetingRoom.maxPersonCount || '-' }}</span>
            </div>
            <div class="break-all line-clamp-2">配置：{{ meetingRoom.equipmentIntro || '-' }}</div>
            <div class="truncate">地址：{{ meetingRoom.address || '-' }}</div>
          </div>
        </div>
      </div>
      <div class="mt-4 px-8">
        <BaseCard>
          <div class="font-bold text-sm mb-2">已占时间</div>
          <div class="flex flex-wrap">
            <ElTag v-for="tItem in timeRangeExists" :key="tItem" type="success" class="my-2 mx-1" size="small">{{ tItem }}</ElTag>
          </div>
        </BaseCard>
      </div>
      <div class="mt-4">
        <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="120px" @keypress.enter="handleSubmit(refForm)">
          <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-select v-model="formField.startTime" start="08:30" step="00:15" end="23:30" class="w-full" placeholder="请选择开始时间" />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-time-select v-model="formField.endTime" :start="formField.startTime" step="00:15" end="23:45" class="w-full" placeholder="请选择结束时间" />
            </el-form-item>
            <el-form-item label="参会人数" prop="personCount">
              <BaseInputNumber v-model="formField.personCount" :precision="0" :min="1" :max="999" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
      <el-button class="mr-6" @click="handleClose"> <BaseIcon icon="ion-close-circle-outline" /> 取消</el-button>
      <el-button type="primary" @click="handleSubmit(refForm)"> <BaseIcon icon="ion-checkmark" /> 提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, unref } from 'vue';
import BaseCard from '/@/components-base/BaseCard.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import { propTypes } from '/@/libs/utils/propTypes';
import BaseInputNumber from '/@/components-base/BaseInput/BaseInputNumber.vue';

const customValidators = {
  validatorStartTime(timeRangeArr: any = []) {
    return (_rule, value, callback) => {
      if (!timeRangeArr || timeRangeArr.length === 0) return callback();
      let hasContain = false;
      timeRangeArr.forEach((i) => {
        const [i1, i2] = `${i}`.split('~');
        if (value >= i1 && value < i2) hasContain = true;
      });
      if (hasContain) callback(new Error('时间不能包括在已有范围内'));
      callback();
    };
  },

  validatorEndTime(startTime, timeRangeArr: any = []) {
    return (_rule, value, callback) => {
      if (!timeRangeArr || timeRangeArr.length === 0) return callback();
      if (!startTime) return callback(new Error('请选择开始时间'));

      let hasContain = false;
      let maxEndTime = '';
      timeRangeArr.forEach((i) => {
        const [i1, i2] = `${i}`.split('~');
        if (value > i1 && value <= i2) hasContain = true;
        if (startTime < i1 && !maxEndTime) maxEndTime = i1;
      });
      if (hasContain) return callback(new Error('时间不能包括在已有范围内'));
      if (maxEndTime && value > maxEndTime) return callback(new Error('时间超出可选范围'));
      if (value <= startTime) return callback(new Error('结束时间必须大于开始时间'));
      callback();
    };
  },
};

const refForm = ref<FormInstance>();

const props = defineProps({
  meetingRoom2: {
    type: Object,
    default: () => {},
  },
  timeRangeExists1: propTypes.array.def([]),
});

const meetingRoom = {
  name: '会议室1',
  roomNumber: '123',
  maxPersonCount: 12,
  equipmentIntro:
    '234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234234234324234234234',
  address: '234234324234234234',
};

const timeRangeExists: any[] = ['09:15~10:30', '11:00~12:30', '13:45~16:00'];

const formField = ref({
  id: '',
  name: '',
  compereId: '',
  meetingRoomId: '',
  personCount: 1,
  startTime: '',
  endTime: '',
  remark: '',
} as any);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  compereId: [{ required: true, message: '请输入主持人', trigger: 'blur' }],
  meetingRoomId: [{ required: true, message: '请选择会议室', trigger: 'change' }],
  startTime: [{ validator: (rule, value, callback) => customValidators.validatorStartTime(timeRangeExists)(rule, value, callback), trigger: 'change' }],
  endTime: [{ validator: (rule, value, callback) => customValidators.validatorEndTime(unref(formField.value.startTime), timeRangeExists)(rule, value, callback), trigger: 'change' }],
});

const emits = defineEmits(['ok', 'cancel']);

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
      // createConfirm('提交', `确定提交?`, () => {
      //   if (unref(formField).id) {
      //     // 编辑
      //     return doEditMeeting(unref(formField));
      //   } else {
      //     // 新增
      //     return doAddMeeting(unref(formField));
      //   }
      // }).then((_action) => {});
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};
</script>

<style scoped lang="css"></style>
