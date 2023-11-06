<!--
  FileDesc  : CompCarEditor
  path      : src/views/pages/affairs/car/components/CompCarEditor.vue
  Author    : genophy
  Version   :
  Usage     :
-->

<template>
  <!--  -->
  <div class="flex flex-col v-comp-car-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="100px" @keypress.enter="handleSubmit(refForm)">
      <div class="flex-1 py-2 pr-6 pl-4 overflow-auto">
        <div class="lg:grid lg:grid-cols-2">
          <el-form-item label="车辆品牌" prop="brand">
            <el-input v-model.trim="formField.brand" placeholder="请输入车辆品牌" maxlength="32" clearable />
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input v-model.trim="formField.model" placeholder="请输入型号" maxlength="32" clearable />
          </el-form-item>
          <el-form-item label="车辆年份" prop="year">
            <el-input v-model.trim="formField.year" placeholder="请输入车辆年份" maxlength="10" clearable />
          </el-form-item>
          <el-form-item label="车牌号" prop="carNumber">
            <el-input v-model.trim="formField.carNumber" placeholder="请输入车牌号" maxlength="32" clearable />
          </el-form-item>

          <el-form-item label="颜色" prop="color">
            <el-input v-model.trim="formField.color" placeholder="请输入颜色" maxlength="32" clearable />
          </el-form-item>
          <el-form-item label="座位数" prop="seating">
            <BaseInputNumber v-model="formField.seating" :precision="0" :min="1" :max="99" />
          </el-form-item>
        </div>
        <ElFormItem label="图片" prop="carImageHexes">
          <BaseImageUploader v-model:str-value="formField.carImageHexes" :limit="9" preview-able edit-able />
        </ElFormItem>
        <el-form-item label="购入日期" prop="buyTime">
          <ElDatePicker v-model="formField.buyTime" type="date" style="width: 100%" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="车检日期" prop="inspectionTime">
          <ElDatePicker v-model="formField.inspectionTime" type="date" style="width: 100%" format="MM-DD" value-format="MM-DD" />
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
import { clone } from 'lodash-es';
import { onMounted, reactive, ref, unref } from 'vue';
import { CarController } from '/@/api';
import BaseImageUploader from '/@/components-base/BaseFile/BaseImageUploader.vue';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseInputNumber from '/@/components-base/BaseInput/BaseInputNumber.vue';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { toMillisecond } from '/@/libs/utils/dateUtil';
import { assignObj } from '/@/libs/utils/langUtil';
const { createConfirm, createNotification } = useMessage();

const props = defineProps({
  carInfo: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(['ok', 'cancel']);

const refForm = ref<FormInstance>();

const formField = ref({
  id: '',
  brand: '',
  model: '',
  year: '',
  carNumber: '',
  color: '',
  seating: 5,
  carImageHexes: '',
  buyTime: '',
  inspectionTime: '',
  remark: '',
} as any);

const formRules = reactive<FormRules>({
  brand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }],
  model: [{ required: true, message: '请输入车辆型号', trigger: 'blur' }],
  year: [{ required: true, message: '请输入车辆年份', trigger: 'blur' }],
  carNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  buyTime: [{ required: true, message: '请选择购入时间', trigger: 'change' }],
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
        const params = clone(unref(formField));
        params.buyTime = params.buyTime ? toMillisecond(params.buyTime, 'YYYY-MM-DD 00:00:00') : null;
        params.inspectionTime = params.inspectionTime ? toMillisecond(`2000-${params.inspectionTime}`, 'YYYY-MM-DD 00:00:00') : null;

        if (params.id) {
          // 编辑
          return doEditCar(params);
        } else {
          // 新增
          return doAddCar(params);
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
const doEditCar = async (params) => {
  return CarController.carUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

/**
 * 新增
 */
const doAddCar = async (params) => {
  return CarController.carAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    emits('ok', true);
  });
};

onMounted(() => {
  assignObj(formField.value, props.carInfo);
});
</script>

<style scoped lang="scss"></style>
