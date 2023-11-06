<template>
  <!--  -->
  <div class="v__exception">
    <el-result :class="prefixCls" :title="title" :sub-title="subTitle">
      <template v-if="icon" #icon>
        <BaseIcon :icon="icon" />
      </template>
      <template v-if="btnText" #extra>
        <el-button type="primary" @click="handler">{{ btnText }}</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
/* ****************************************************************** */
/* props emits  ----------------------------------------------------- */
/* const let (use store) -------------------------------------------- */
/* compute watch subscribe ------------------------------------------ */
/* method (handle public private) ----------------------------------- */
/* life cycle ------------------------------------------------------- */
/* expose ----------------------------------------------------------- */
/* *****
 ************************************************************* */

import { PropType, unref } from 'vue';
import notDataSvg from '/@/assets/icons/no-data.svg';
import netWorkSvg from '/@/assets/icons/net-error.svg';
import { ExceptionEnum } from '/@/libs/enums/exceptionEnum';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDesign } from '/@/libs/hooks/web/useDesign';
import { useGo, useRedo } from '/@/libs/hooks/web/usePage';
import { useI18n } from '/@/libs/hooks/web/useI18n';
import BaseIcon from '/@/components-base/BaseIcon';
import { PageEnum } from '/@/libs/enums/pageEnum';

interface MapValue {
  title: string;
  subTitle: string;
  btnText?: string;
  icon?: string;
  handler?: Fn;
  status?: string;
}
const { prefixCls } = useDesign('app-exception-page');

const { query } = useRoute();

const go = useGo();
const redo = useRedo();
const { t } = useI18n();

const props = defineProps({
  // 状态码
  status: {
    type: Number as PropType<number>,
    default: ExceptionEnum.PAGE_NOT_FOUND,
  },

  title: {
    type: String as PropType<string>,
    default: '',
  },

  subTitle: {
    type: String as PropType<string>,
    default: '',
  },

  full: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const statusMapRef = ref(new Map<string | number, MapValue>());

const getStatus = computed(() => {
  const { status: routeStatus } = query;
  const { status } = props;
  return Number(routeStatus) || status;
});

const getMapValue = computed((): MapValue => {
  return unref(statusMapRef).get(unref(getStatus)) as MapValue;
});

const backLoginI18n = t('sys.exception.backLogin');
const backHomeI18n = t('sys.exception.backHome');

unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_ACCESS, {
  title: '403',
  status: `${ExceptionEnum.PAGE_NOT_ACCESS}`,
  subTitle: t('sys.exception.subTitle403'),
  btnText: props.full ? backLoginI18n : backHomeI18n,
  handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
});

unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
  title: '404',
  status: `${ExceptionEnum.PAGE_NOT_FOUND}`,
  subTitle: t('sys.exception.subTitle404'),
  btnText: props.full ? backLoginI18n : backHomeI18n,
  handler: () => (props.full ? go(PageEnum.MAIN_HOME) : go()),
});

unref(statusMapRef).set(ExceptionEnum.ERROR, {
  title: '500',
  status: `${ExceptionEnum.ERROR}`,
  subTitle: t('sys.exception.subTitle500'),
  btnText: backHomeI18n,
  handler: () => go(),
});

unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
  title: t('sys.exception.noDataTitle'),
  subTitle: '',
  btnText: t('common.redo'),
  handler: () => redo(),
  icon: notDataSvg,
});

unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
  title: t('sys.exception.networkErrorTitle'),
  subTitle: t('sys.exception.networkErrorSubTitle'),
  btnText: t('common.redo'),
  handler: () => redo(),
  icon: netWorkSvg,
});

const { title, subTitle, btnText, icon, handler } = unref(getMapValue) || {};
</script>

<style scoped lang="scss"></style>
