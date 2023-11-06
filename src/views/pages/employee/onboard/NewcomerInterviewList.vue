<!--
  FileDesc  : NewcomerInterviewList 新人面试管理
  path      : src/views/pages/employee/onboard/NewcomerInterviewList.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v-newcomer-interview-list"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryResumeList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="80" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" @keypress.enter="triggerSearch">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchField.name" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item label="岗位" prop="employeePostId">
          <el-select v-model="searchField.employeePostId" placeholder="请选择岗位" filterable clearable class="w-full">
            <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学历" prop="academicTypes">
          <el-select v-model="searchField.academicTypes" placeholder="请选择学历" filterable multiple clearable class="w-full">
            <el-option v-for="item in ACADEMIC_TYPE" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="安排面试" prop="interviewFlag">
          <el-select v-model="searchField.interviewFlag" placeholder="请选择是否已安排面试" filterable clearable class="w-full">
            <el-option :value="1" label="是">是</el-option>
            <el-option :value="0" label="否">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!mobileMode">
          <el-button type="primary" :loading="queryStatus === queryStatusEnum.querying" @click="triggerSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作区域 ------------------------------------------------------------- -->

    <template #ops>
      <div class="flex px-4 pb-2 items-center justify-end">
        <div class="flex mr-4 items-center">
          <el-checkbox v-model="isBatchMgt" @change="handleToggleBatchMgt">
            <span class="mx-2 text-sm">批量管理 </span>
          </el-checkbox>
        </div>
        <el-button :disabled="checkedInterviewsCount === 0" type="danger" class="w-30" @click="handleBatchDelResumes">
          <BaseIcon icon="ion-trash" class="mr-1" />删除
          <span v-show="isBatchMgt">（{{ checkedInterviewsCount }}）</span>
        </el-button>
        <el-button text type="success" @click="handleAddResume">
          <BaseIcon icon="ion-add-outline" />
          新增</el-button
        >
      </div>
    </template>

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <div class="p-4 ly-grid">
        <template v-for="item in list" :key="item.id">
          <BaseCard :shadow="isBatchMgt ? 'hover' : 'never'" class="mt-10 relative" :class="{ 'cursor-pointer active:opacity-80': isBatchMgt }" @click="isBatchMgt && handleSelectInterviews(item)">
            <template v-if="item.resume">
              <div v-if="item.resume.resumeFileHex && !isBatchMgt" class="top-2 right-2 z-10 absolute">
                <ElButton size="default" type="success" plain @click="handlePreviewResume(item.resume.resumeFileHex)">查看简历</ElButton>
              </div>
              <!-- 面试状态 -->

              <div class="text-xs text-white transform -translate-y-full top-0 right-0 left-20 z-1 absolute">
                <div v-if="item.status === 1" class="bg-orange-300 rounded-tr-2xl py-1 pr-2 pl-10 dark:bg-orange-400">进行中</div>
                <div v-else-if="item.status === 2" class="bg-green-400 rounded-tr-2xl py-1 pr-2 pl-10 dark:bg-green-600">通过</div>
                <div v-else-if="item.status === 3" class="bg-red-300 rounded-tr-2xl py-1 pr-2 pl-10 dark:bg-red-800">失败</div>
                <div v-else class="bg-gray-400 rounded-tr-2xl py-1 pr-2 pl-10">未开始</div>
              </div>

              <!-- 面试头像 -->
              <div v-if="item.resume.id" class="h-10 relative">
                <BaseImage class="-top-15 left-0 z-10 absolute" :img-list="[item.resume.avatar]" :size="80" preview round>
                  <template #error>
                    <div class="flex h-full justify-center items-center">
                      <BaseIcon icon="ion:person-sharp" :size="48" class="text-2xl text-gray-200 dark:text-gray-600" />
                    </div>
                  </template>
                </BaseImage>
              </div>

              <el-descriptions :title="item.resume.name" :column="2" size="small" direction="horizontal" :class="{ 'opacity-40': !item.enabled }">
                <template #title>
                  <div class="flex h-6 items-center">
                    <div v-show="isBatchMgt" class="mr-2 top-3 right-2 absolute">
                      <BaseIcon
                        :size="24"
                        :icon="checkedInterviews[item.resume.id] ? 'ion:checkbox' : 'ion-stop-outline'"
                        :class="{ 'text-blue-500': checkedInterviews[item.id], 'text-gray-400': !checkedInterviews[item.id] }"
                      />
                    </div>
                    <span class="font-extrabold text-lg">{{ item.resume.name }}</span
                    ><span class="text-xs ml-4">{{ listFind(item.resume.gender, SEX_TYPE, 'id', 'name') || '-' }}</span>
                  </div>
                </template>

                <el-descriptions-item label="年龄" :span="1">{{ item.resume.age ? `${item.resume.age}岁` : '-' }}</el-descriptions-item>
                <el-descriptions-item label="工龄" :span="1">{{ item.resume.workYear ? `${item.resume.workYear}年` : '-' }}</el-descriptions-item>
                <el-descriptions-item label="岗位" :span="1">{{ item.resume.employeePost?.name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="学历" :span="1">{{ listFind(item.resume.academicType, ACADEMIC_TYPE, 'id', 'name') || '-' }}</el-descriptions-item>
                <el-descriptions-item label="学校" :span="2">{{ item.resume.school || '-' }}</el-descriptions-item>
                <el-descriptions-item label="手机号" :span="2">{{ item.resume.phone || '-' }}</el-descriptions-item>
                <el-descriptions-item label="QQ号" :span="1">{{ item.resume.qq || '-' }}</el-descriptions-item>
                <el-descriptions-item label="微信号" :span="1">{{ item.resume.wechat || '-' }}</el-descriptions-item>
              </el-descriptions>
            </template>
            <template #footer>
              <div v-show="!isBatchMgt" class="flex mt-2 justify-between items-center">
                <div>
                  <ElRate v-model="item.rate" :disabled="item.status === 2 || item.status === 3" :allow-half="false" size="large" :max="5" clearable @change="handleChangeRate(item)" />
                </div>
                <!-- 已经设置，则无法拒绝 2 成功 3 失败 -->
                <div v-if="item.status !== 2 && item.status !== 3" class="flex items-end">
                  <el-popconfirm title="确定删除？" @confirm="handleDelResume(item)">
                    <template #reference>
                      <el-button type="danger" size="small" class="mr-2"> <BaseIcon icon="ion:remove-circle-outline" /> 拒绝</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button v-if="item.status !== 2 && item.status !== 3" type="primary" size="default" @click="handleEditResult(item)"> <BaseIcon icon="ion:create-outline" />面试结果</el-button>
                </div>
                <!-- 若未入职，还可撤回 -->
                <div v-else-if="item.status !== 4">
                  <el-button type="default" size="default" @click="handleEditResult(item)"> <BaseIcon icon="ion:arrow-undo-outline" />撤回更改</el-button>
                </div>
              </div>
            </template>
          </BaseCard>
        </template>
      </div>
    </template>
  </BaseQueryDataPagination>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { keys, pickBy } from 'lodash-es';
import { Ref, computed, getCurrentInstance, onMounted, reactive, ref, unref } from 'vue';
import CompEmployeeResumeEditor from './components/CompEmployeeResumeEditor.vue';
import CompSetInterviewResult from './components/CompSetInterviewResult.vue';
import { EmployeePostController, FileStoreController, ResumeInterviewController } from '/@/api';
import BaseCard from '/@/components-base/BaseCard.vue';
import BasePdfViewer from '/@/components-base/BaseDocViewer/BasePdfViewer.vue';
import BaseIcon from '/@/components-base/BaseIcon/src/BaseIcon.vue';
import BaseImage from '/@/components-base/BaseImage/BaseImage.vue';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { ACADEMIC_TYPE, SEX_TYPE } from '/@/libs/utils/constants';
import { downloadByData } from '/@/libs/utils/file/download';
import { assignObj, listFind } from '/@/libs/utils/langUtil';

const { createConfirm, createNotification } = useMessage();

// const dynDialog = useDynDialog();
const dynDialog = (getCurrentInstance() as any).proxy.$DynModal;

// 搜索表单Ref （重置表单数据用）
const refSearch = ref<FormInstance>();
// 基础Query分页Ref
const refPagination = ref<InstanceType<typeof BaseQueryDataPagination>>();
// 是否正在提交
const isSubmitting = ref(false);
// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);
// 是否批量管理
const isBatchMgt = ref(false);
// 批量选中的所有面试
const checkedInterviews = ref({});
// 选中的面试数量
const checkedInterviewsCount = computed(() => Object.values(checkedInterviews.value).filter((v) => !!v).length);
const postList = ref([] as any);

// 查询条件
const searchField = reactive({
  name: '',
  employeePostId: '',
  academicTypes: [],
  interviewFlag: '',
});

/**
 * 查询排序
 */
const queryOrder = {
  createTime: 'DESC',
};

/**
 * 切换批量管理
 */
const handleToggleBatchMgt = () => {
  // isBatchMgt.value = flag ?? !isBatchMgt.value;
  checkedInterviews.value = {};
};

/**
 * 选择面试
 */
const handleSelectInterviews = (_interview) => {
  checkedInterviews.value[_interview.id] = !checkedInterviews.value[_interview.id];
};
/**
 * 预览
 */
const handlePreviewResume = async (fileHex) => {
  const fileInfo = await FileStoreController.fileStoreFileInfo(fileHex);
  if (~(fileInfo.type || '').indexOf('pdf')) {
    dynDialog.open(BasePdfViewer, { hex: fileHex }, { title: '面试详情' });
  } else {
    FileStoreController.fileStoreDownload(fileInfo.fileHex || '', {}, 'message', { responseType: 'blob' }, { isReturnNativeResponse: true }).then((resp) => {
      const disposition = resp.headers['content-disposition'] || '';
      const fileName = (disposition.match(/.*?filename="(.*?)"/) || [])[1];
      downloadByData(resp.data, fileName);
    });
  }
};

/**
 * 新增面试
 */
const handleAddResume = () => {
  dynDialog.open(CompEmployeeResumeEditor, {}, { title: '新增' }).then((res) => {
    if (res.type === 'ok') {
      refSearch.value?.resetFields();
      refPagination.value?.triggerSearch();
    }
  });
};

/**
 * 编辑面试结果
 */
const handleEditResult = (_interview) => {
  dynDialog.open(CompSetInterviewResult, { interviewInfo: _interview }, { title: '设置面试结果', width: '600px' }).then((res) => {
    if (res.type === 'ok') {
      refPagination.value?.triggerRefresh();
    }
  });
};

/**
 * 批量删除面试
 */
const handleBatchDelResumes = () => {
  createConfirm('批量删除', `确定批量删除${unref(checkedInterviewsCount)}个面试？`, () => {
    return new Promise((resolve) => {
      const ids = keys(pickBy(unref(checkedInterviews), (v) => v === true));

      ResumeInterviewController.resumeInterviewBatchDel({ ids }, 'message')
        .then(() => {
          createNotification.success('删除', '删除成功');
          refPagination.value?.triggerRefresh();
          handleToggleBatchMgt();
        })
        .finally(() => {
          resolve(true);
        });
    });
  });
};

/**
 * 删除面试
 */
const handleDelResume = (_interview) => {
  ResumeInterviewController.resumeInterviewBatchDel({ ids: [_interview.id] }, 'message')
    .then(() => {
      createNotification.success('删除', '删除成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

/**
 * 改变面试评分
 */
const handleChangeRate = (_interview) => {
  ResumeInterviewController.resumeInterviewChangeRate({ id: _interview.id, rate: _interview.rate }).then(() => {
    createNotification.success('提交', '提交成功');
  });
};

/**
 * 查询面试列表
 */
const queryResumeList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await ResumeInterviewController.resumeInterviewList(params, 'message');
    callback(list);
    queryStatus.value = refPagination.value ? refPagination.value.setRecordTotal(total) : queryStatusEnum.ready;
  } catch (error) {
    callback();
    if (refPagination.value) refPagination.value.setRecordTotal(0);
    queryStatus.value = queryStatusEnum.fail;
  }
};

/**
 * 查询所哟岗位
 */
const queryAllPostList = async () => {
  const { list } = await EmployeePostController.employeePostListAll();
  postList.value = list;
};

onMounted(() => {
  queryAllPostList();
  refPagination.value?.triggerSearch();
});
</script>

<style scoped lang="scss"></style>
