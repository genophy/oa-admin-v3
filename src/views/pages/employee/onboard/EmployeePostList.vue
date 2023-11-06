<!--
  FileDesc  : EmployeePostList 员工岗位列表
  path      : src/views/pages/employee/EmployeePostList.vue
  Author    : genophy
  Version   :
  Usage     :
-->

<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v__employee-post-list"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="80" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" @keypress.enter="triggerSearch">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchField.name" placeholder="名称" clearable />
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
        <el-button :disabled="checkedPostsCount === 0" type="danger" class="w-30" @click="handleBatchDelUsers">
          <BaseIcon icon="ion-trash" class="mr-1" />删除
          <span v-show="isBatchMgt">（{{ checkedPostsCount }}）</span>
        </el-button>
        <el-button text type="success" @click="handleAddUser">
          <BaseIcon icon="ion-add-outline" />
          新增</el-button
        >
      </div>
    </template>

    <!-- 内容区域 ------------------------------------------------------------- -->

    <template #default="{ list }">
      <div class="p-4 ly-grid">
        <template v-for="item in list" :key="item.id">
          <BaseCard :shadow="isBatchMgt ? 'hover' : 'never'" class="relative" :class="{ 'cursor-pointer active:opacity-80': isBatchMgt }" @click="isBatchMgt && handleSelectUser(item)">
            <el-descriptions size="small" :title="item.name" :column="2" direction="horizontal" :class="{ 'opacity-40': !item.enabled }">
              <template #title>
                <div class="flex h-6 items-center">
                  <div v-show="isBatchMgt" class="mr-2 top-3 right-2 absolute">
                    <BaseIcon
                      :size="24"
                      :icon="checkedPosts[item.id] ? 'ion:checkbox' : 'ion-stop-outline'"
                      :class="{ 'text-blue-500': checkedPosts[item.id], 'text-gray-400': !checkedPosts[item.id] }"
                    />
                  </div>
                  <span class="font-extrabold text-lg">{{ item.name }}</span>
                </div>
              </template>
              <el-descriptions-item label="部门" :span="2">{{ mapListByKey(item.departments, 'name') || '-' }}</el-descriptions-item>
            </el-descriptions>
            <template #footer>
              <div v-show="!isBatchMgt" class="flex mt-2 justify-end">
                <div class="flex">
                  <el-popconfirm title="确定删除？" @confirm="handleDelUser(item)">
                    <template #reference>
                      <el-button type="danger" size="small" class="mr-2"> <BaseIcon icon="ion:trash" /> 删除</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button type="primary" size="small" @click="handleEditUser(item)"> <BaseIcon icon="ion:create-outline" /> 编辑</el-button>
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
import CompEmployeePostEditor from './components/CompEmployeePostEditor.vue';
import { EmployeePostController } from '/@/api';
import BaseCard from '/@/components-base/BaseCard.vue';
import BaseIcon from '/@/components-base/BaseIcon/src/BaseIcon.vue';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { assignObj } from '/@/libs/utils/langUtil';

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
// 批量选中的所有岗位
const checkedPosts = ref({});
// 选中的岗位数量
const checkedPostsCount = computed(() => Object.values(checkedPosts.value).filter((v) => !!v).length);

// 查询条件
const searchField = reactive({
  account: '',
  name: '',
  institutionId: '',
  institutionScope: '', // '1'  仅本级 '' 全部
});

/**
 * 查询排序
 */
const queryOrder = {
  createTime: 'DESC',
};

/**
 * 从中列表找出 key 值
 * @param list
 */
const mapListByKey = (list, key) => (list || []).map((item) => item[key]).join(',');

/**
 * 切换批量管理
 */
const handleToggleBatchMgt = () => {
  // isBatchMgt.value = flag ?? !isBatchMgt.value;
  checkedPosts.value = {};
};

/**
 * 选择岗位
 */
const handleSelectUser = (_post) => {
  checkedPosts.value[_post.id] = !checkedPosts.value[_post.id];
};

/**
 * 新增岗位
 */
const handleAddUser = () => {
  dynDialog.open(CompEmployeePostEditor, {}, { title: '新增', width: '400px' }).then((res) => {
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
 * 编辑岗位
 */
const handleEditUser = (_post) => {
  dynDialog.open(CompEmployeePostEditor, { postInfo: _post }, { title: '编辑', width: '400px' }).then((res) => {
    if (res.type === 'ok') {
      console.log('你点击了确定');
      refPagination.value?.triggerRefresh();
    } else {
      console.log('你点击了关闭');
    }
  });
};

/**
 * 批量删除岗位
 */
const handleBatchDelUsers = () => {
  createConfirm('批量删除', `确定批量删除${unref(checkedPostsCount)}个岗位？`, () => {
    return new Promise((resolve) => {
      const ids = keys(pickBy(unref(checkedPosts), (v) => v === true));

      EmployeePostController.employeePostBatchDel({ ids }, 'message')
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
 * 删除岗位
 */
const handleDelUser = (_post) => {
  EmployeePostController.delete_employeePost(_post.id, {}, 'message')
    .then(() => {
      createNotification.success('删除', '删除成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

/**
 * 查询岗位列表
 */
const queryList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await EmployeePostController.employeePostList(params, 'message');
    callback(list);
    queryStatus.value = refPagination.value ? refPagination.value.setRecordTotal(total) : queryStatusEnum.ready;
  } catch (error) {
    callback();
    if (refPagination.value) refPagination.value.setRecordTotal(0);
    queryStatus.value = queryStatusEnum.fail;
  }
};

onMounted(() => {
  refPagination.value?.triggerSearch();
});
</script>

<style scoped lang="scss"></style>
