<!--
  FileDesc  : NewComerResumeList 新人简历列表
  path      : src/views/pages/employee/NewcomerResumeList.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v-newcomer-resume-list"
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
        <el-button :disabled="checkedResumesCount === 0" type="danger" class="w-30" @click="handleBatchDelResumes">
          <BaseIcon icon="ion-trash" class="mr-1" />删除
          <span v-show="isBatchMgt">（{{ checkedResumesCount }}）</span>
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
          <BaseCard
            :shadow="isBatchMgt ? 'hover' : 'never'"
            class="mt-10 relative"
            :class="{ 'cursor-pointer active:opacity-80': isBatchMgt, 'shadow-green-400': item.resumeInterview?.interviewTime }"
            @click="isBatchMgt && handleSelectResume(item)"
          >
            <div v-if="item.fileResume?.fileHex && !isBatchMgt" class="top-2 right-2 z-10 absolute">
              <ElButton size="default" type="success" plain @click="handlePreviewResume(item.fileResume?.fileHex)">查看简历</ElButton>
            </div>
            <!-- 简历头像 -->
            <div v-if="item.id" class="h-10 relative">
              <BaseImage class="-top-15 left-0 absolute" :img-list="[item.avatar]" preview :size="80" round>
                <template #error>
                  <div class="flex h-full justify-center items-center">
                    <BaseIcon icon="ion:person-sharp" :size="48" class="text-2xl text-gray-200 dark:text-gray-600" />
                  </div>
                </template>
              </BaseImage>
            </div>

            <el-descriptions :title="item.name" :column="2" size="small" direction="horizontal" :class="{ 'opacity-40': !item.enabled }">
              <template #title>
                <!-- 若未更新面试 -->
                <div v-if="!item.resumeInterview || item.resumeInterview?.status === 0" class="flex h-6 items-center">
                  <div v-show="isBatchMgt" class="mr-2 top-3 right-2 absolute">
                    <BaseIcon
                      :size="24"
                      :icon="checkedResumes[item.id] ? 'ion:checkbox' : 'ion-stop-outline'"
                      :class="{ 'text-blue-500': checkedResumes[item.id], 'text-gray-400': !checkedResumes[item.id] }"
                    />
                  </div>
                  <span class="font-extrabold text-lg">{{ item.name }}</span
                  ><span class="text-xs ml-4">{{ listFind(item.gender, SEX_TYPE, 'id', 'name') || '-' }}</span>
                </div>
              </template>

              <el-descriptions-item label="年龄" :span="1">{{ item.age ? `${item.age}岁` : '-' }}</el-descriptions-item>
              <el-descriptions-item label="工龄" :span="1">{{ item.workYear ? `${item.workYear}年` : '-' }}</el-descriptions-item>
              <el-descriptions-item label="岗位" :span="1">{{ item.employeePost?.name || '-' }}</el-descriptions-item>
              <el-descriptions-item label="学历" :span="1">{{ listFind(item.academicType, ACADEMIC_TYPE, 'id', 'name') || '-' }}</el-descriptions-item>
              <el-descriptions-item label="学校" :span="2">{{ item.school || '-' }}</el-descriptions-item>
              <el-descriptions-item label="手机号" :span="2">{{ item.phone || '-' }}</el-descriptions-item>
              <el-descriptions-item label="QQ号" :span="1">{{ item.qq || '-' }}</el-descriptions-item>
              <el-descriptions-item label="微信号" :span="1">{{ item.wechat || '-' }}</el-descriptions-item>

              <el-descriptions-item :span="2">
                <BaseCard class="select-none">
                  <div v-if="item.resumeInterview?.interviewTime" class="relative">
                    <el-popconfirm v-if="!isBatchMgt && item.resumeInterview?.status === 0" title="确定取消面试？" @confirm="handleUnAssignInterview(item)">
                      <template #reference>
                        <BaseIcon icon="ion:close-circle" :size="28" class="-top-6 -right-6 text-red-400 z-10 ly-btn absolute" />
                      </template>
                    </el-popconfirm>
                    <div
                      >面试部门:
                      <span>{{ mapListByKey(item.resumeInterview.interviewDepartments, 'name') || '-' }}</span>
                    </div>
                    <div
                      >面试时间:
                      <span>{{ toDateStr(item.resumeInterview.interviewTime) }}</span>
                    </div>
                    <div
                      >面试评分:
                      <ElRate v-model="item.resumeInterview.rate" :disabled="true" :allow-half="false" size="small" :max="5" clearable />
                    </div>
                    <!-- 面试结果-盖章 -->
                    <BaseSealStatus class="transform top-0 right-0 w-15 rotate-15 absolute" :current="item.resumeInterview?.status" :list="statusList" />
                  </div>
                  <div v-else>
                    <el-button type="success" :disabled="isBatchMgt" plain class="w-full" @click="handleAssignInterview(item)"
                      ><BaseIcon icon="ion:checkmark-circle-outline" class="mr-2" /> 安排面试</el-button
                    >
                  </div>
                </BaseCard>
              </el-descriptions-item>
            </el-descriptions>

            <template #footer>
              <div v-show="!isBatchMgt" class="flex mt-2 justify-end">
                <!-- 若未更新面试 -->

                <el-popconfirm v-if="!item.resumeInterview || item.resumeInterview?.status === 3" title="确定删除？" @confirm="handleDelResume(item)">
                  <template #reference>
                    <el-button type="danger" size="small" class="mr-2"> <BaseIcon icon="ion:trash" /> 删除</el-button>
                  </template>
                </el-popconfirm>
                <el-button v-if="!item.resumeInterview || item.resumeInterview?.status === 0" type="primary" size="small" @click="handleEditResume(item)">
                  <BaseIcon icon="ion:create-outline" />编辑
                </el-button>
                <div v-if="item.resumeInterview?.status === 2">
                  <el-button type="success" size="default" @click="handleEntry(item)"> <BaseIcon icon="ion:add-circle-outline" />安排入职</el-button>
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
import CompEmployeeAssignInterview from './components/CompEmployeeAssignInterview.vue';
import CompEmployeeResumeEditor from './components/CompEmployeeResumeEditor.vue';
import { EmployeePostController, FileStoreController, ResumeController } from '/@/api';
import BaseCard from '/@/components-base/BaseCard.vue';
import BasePdfViewer from '/@/components-base/BaseDocViewer/BasePdfViewer.vue';
import BaseIcon from '/@/components-base/BaseIcon/src/BaseIcon.vue';
import BaseImage from '/@/components-base/BaseImage/BaseImage.vue';
import BaseSealStatus from '/@/components-base/BaseSeal/BaseSealStatus.vue';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { ACADEMIC_TYPE, SEX_TYPE } from '/@/libs/utils/constants';
import { toDateStr } from '/@/libs/utils/dateUtil';
import { downloadByData } from '/@/libs/utils/file/download';
import { assignObj, listFind } from '/@/libs/utils/langUtil';
import CompUserEditor from '../../system/components/CompUserEditor.vue';

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
// 批量选中的所有简历
const checkedResumes = ref({});
// 选中的简历数量
const checkedResumesCount = computed(() => Object.values(checkedResumes.value).filter((v) => !!v).length);
const postList = ref([] as any);

/**
 * 从中列表找出出 key 值
 * @param list
 */
const mapListByKey = (list, key) => (list || []).map((item) => item[key]).join(',');

const statusList = [
  { id: 0, text: '未开始', color: '#929292' },
  { id: 1, text: '进行中', color: '#0096FF' },
  { id: 2, text: '通过', color: '#008F00' },
  { id: 3, text: '失败', color: '#FF7E79' },
];
// const colorClassMap = (key) => {
//   let color = '';
//   switch (key) {
//     case 1:
//       color = 'text-orange-300 border-orange-300';
//       break;
//     case 2:
//       color = 'text-green-600 border-green-600';
//       break;
//     case 3:
//       color = 'text-red-300 border-red-300';
//       break;

//     default:
//       color = 'text-gray-400 border-gray-400';
//       break;
//   }
//   return color;
// };

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
  checkedResumes.value = {};
};

/**
 * 选择简历
 */
const handleSelectResume = (_resume) => {
  checkedResumes.value[_resume.id] = !checkedResumes.value[_resume.id];
};

/**
 * 安排面试
 * @param _resume
 */
const handleAssignInterview = (_resume) => {
  dynDialog.open(CompEmployeeAssignInterview, { resumeInfo: _resume }, { title: '安排面试', width: '400px' }).then((res) => {
    if (res.type === 'ok') {
      refPagination.value?.triggerRefresh();
    }
  });
};

/**
 * 取消面试
 * @param _resume
 */
const handleUnAssignInterview = (_resume) => {
  ResumeController.resumeUnassignInterview(_resume.id)
    .then(() => {
      createNotification.success('取消面试', '取消成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

/**
 * 预览
 */
const handlePreviewResume = async (fileHex) => {
  const fileInfo = await FileStoreController.fileStoreFileInfo(fileHex);
  if (~(fileInfo.type || '').indexOf('pdf')) {
    dynDialog.open(BasePdfViewer, { hex: fileHex }, { title: '简历详情' });
  } else {
    FileStoreController.fileStoreDownload(fileInfo.fileHex || '', {}, 'message', { responseType: 'blob' }, { isReturnNativeResponse: true }).then((resp) => {
      const disposition = resp.headers['content-disposition'] || '';
      const fileName = (disposition.match(/.*?filename="(.*?)"/) || [])[1];
      downloadByData(resp.data, fileName);
    });
  }
};

/**
 * 新增简历
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
 * 编辑简历
 */
const handleEditResume = (_resume) => {
  dynDialog.open(CompEmployeeResumeEditor, { resumeInfo: _resume }, { title: '编辑' }).then((res) => {
    if (res.type === 'ok') {
      refPagination.value?.triggerRefresh();
    }
  });
};

/**
 * 安排入职
 * @param _resume
 */
const handleEntry = (_resume) => {
  dynDialog
    .open(
      CompUserEditor,
      {
        userInfo: {
          resumeId: _resume.id,
          name: _resume.name,
          avatar: _resume.avatar,
          admin: false,
          phone: _resume.phone,
          qq: _resume.qq,
          wechat: _resume.wechat,
          departments: _resume.employeePost?.departments,
        },
      },
      { title: '入职登记' },
    )
    .then((res) => {
      if (res.type === 'ok') {
        console.log('你点击了确定');
        refSearch.value?.resetFields();
        refPagination.value?.triggerSearch();
      } else {
        console.log('你点击了关闭');
      }
    });
};

/**
 * 批量删除简历
 */
const handleBatchDelResumes = () => {
  createConfirm('批量删除', `确定批量删除${unref(checkedResumesCount)}个简历？`, () => {
    return new Promise((resolve) => {
      const ids = keys(pickBy(unref(checkedResumes), (v) => v === true));

      ResumeController.resumeBatchDel({ ids }, 'message')
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
 * 删除简历
 */
const handleDelResume = (_resume) => {
  ResumeController.resumeBatchDel({ ids: [_resume.id] }, 'message')
    .then(() => {
      createNotification.success('删除', '删除成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

/**
 * 查询简历列表
 */
const queryResumeList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await ResumeController.resumeList(params, 'message');
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
