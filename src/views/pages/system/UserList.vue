<!--
  FileDesc  : 
  path      :
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <BaseQueryDataPagination
    ref="refPagination"
    :query-status="queryStatus"
    :query-order="queryOrder"
    class="h-full v__user-list"
    @reset="refSearch?.resetFields()"
    @search="refPagination?.search(searchField)"
    @query="queryUserList"
  >
    <!-- 查询区域 ------------------------------------------------------------- -->

    <template #search="{ mobileMode, triggerSearch }">
      <el-form ref="refSearch" :model="searchField" inline :label-width="80" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" @keypress.enter="triggerSearch">
        <el-form-item label="账号" prop="account">
          <el-input v-model="searchField.account" placeholder="账号" clearable />
        </el-form-item>
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
        <el-button :disabled="checkedUsersCount === 0" type="danger" class="w-30" @click="handleBatchDelUsers">
          <BaseIcon icon="ion-trash" class="mr-1" />删除
          <span v-show="isBatchMgt">（{{ checkedUsersCount }}）</span>
        </el-button>
        <el-button :disabled="checkedUsersCount === 0" type="warning" class="w-30" @click="handleBatchMgtUserPermissions">
          <BaseIcon icon="ion:checkmark-done" class="mr-1" />管理权限
          <span v-show="isBatchMgt">（{{ checkedUsersCount }}）</span>
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
          <BaseCard :shadow="isBatchMgt ? 'hover' : 'never'" class="mt-10 relative" :class="{ 'cursor-pointer active:opacity-80': isBatchMgt }" @click="isBatchMgt && handleSelectUser(item)">
            <!-- 用户头像 -->
            <div v-if="item.id" class="h-10 relative">
              <BaseImage class="-top-15 left-0 absolute" :img-list="[item.avatar]" :size="80" round>
                <template #error>
                  <div class="flex h-full justify-center items-center">
                    <BaseIcon icon="ion:person-sharp" :size="48" class="text-2xl text-gray-200 dark:text-gray-600" />
                  </div>
                </template>
              </BaseImage>
            </div>

            <div v-show="!isBatchMgt" class="flex text-xs top-2 right-8 z-10 items-center absolute">
              <span v-if="item.enabled">可用</span>
              <span v-else class="opacity-60">冻结</span>
              <el-switch v-model="item.enabled" class="mx-2" :loading="isSubmitting" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #999999" @change="handleEnableUser(item)" />
            </div>

            <el-descriptions :title="item.account" :column="2" direction="horizontal" size="small" :class="{ 'opacity-40': !item.enabled }">
              <template #title>
                <div class="flex h-6 items-center">
                  <div v-show="isBatchMgt" class="mr-2 top-3 right-2 absolute">
                    <BaseIcon
                      :size="24"
                      :icon="checkedUsers[item.id] ? 'ion:checkbox' : 'ion-stop-outline'"
                      :class="{ 'text-blue-500': checkedUsers[item.id], 'text-gray-400': !checkedUsers[item.id] }"
                    />
                  </div>
                  <span class="font-extrabold text-lg">{{ item.account }}</span>
                </div>
              </template>

              <el-descriptions-item label="名称" :span="2">{{ item.name || '-' }}</el-descriptions-item>

              <!-- 若是管理员 -->
              <el-descriptions-item v-if="item.admin" label="角色" :span="2">管理员</el-descriptions-item>
              <template v-else>
                <el-descriptions-item label="角色" :span="2">{{ mapListByKey(item.roles, 'name') || '-' }}</el-descriptions-item>
                <el-descriptions-item label="部门" :span="2">{{ mapListByKey(item.departments, 'name') || '-' }}</el-descriptions-item>
                <el-descriptions-item label="部门权限" :span="2"> {{ listFind(item.permissionScope, USER_PERMISSION_SCOPE) || '-' }}</el-descriptions-item>
                <el-descriptions-item label="手机号" :span="2">{{ item.phone || '-' }}</el-descriptions-item>
                <el-descriptions-item label="QQ号" :span="1">{{ item.qq || '-' }}</el-descriptions-item>
                <el-descriptions-item label="微信号" :span="1">{{ item.wechat || '-' }}</el-descriptions-item>
                <el-descriptions-item label="账号有效期" :span="2"
                  >{{ toDateStr(item.effectiveTimeStart, 'YYYY-MM-DD') || '-' }} 至 {{ toDateStr(item.effectiveTimeEnd, 'YYYY-MM-DD') || '-' }}</el-descriptions-item
                >
              </template>
              <el-descriptions-item label="最近登录IP" :span="2">{{ item.latestIp || '-' }}</el-descriptions-item>
            </el-descriptions>
            <template #footer>
              <div v-show="!isBatchMgt" class="flex mt-2 justify-between">
                <div>
                  <el-popconfirm title="确定重置密码？" @confirm="handleResetUserPwd(item)">
                    <template #reference>
                      <el-button size="small"> <BaseIcon icon="ion:key-outline" /> 重置密码</el-button>
                    </template>
                  </el-popconfirm>
                </div>
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
import BaseCard from '/@/components-base/BaseCard.vue';
import CompBatchMgtUserPermissions from './components/CompBatchMgtUserPermissions.vue';
import CompUserEditor from './components/CompUserEditor.vue';
import { UserController } from '/@/api';
import BaseIcon from '/@/components-base/BaseIcon/src/BaseIcon.vue';
import BaseImage from '/@/components-base/BaseImage/BaseImage.vue';
import BaseQueryDataPagination from '/@/components-base/BasePagination/BaseQueryDataPagination.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { USER_PERMISSION_SCOPE } from '/@/libs/utils/constants';
import { toDateStr } from '/@/libs/utils/dateUtil';
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
// 批量选中的所有用户
const checkedUsers = ref({});
// 选中的用户数量
const checkedUsersCount = computed(() => Object.values(checkedUsers.value).filter((v) => !!v).length);

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
 * 从中列表找出出 key 值
 * @param list
 */
const mapListByKey = (list, key) => (list || []).map((item) => item[key]).join(',');

/**
 * 切换批量管理
 */
const handleToggleBatchMgt = () => {
  // isBatchMgt.value = flag ?? !isBatchMgt.value;
  checkedUsers.value = {};
};

/**
 * 选择用户
 */
const handleSelectUser = (_user) => {
  checkedUsers.value[_user.id] = !checkedUsers.value[_user.id];
};

/**
 * 新增用户
 */
const handleAddUser = () => {
  dynDialog.open(CompUserEditor, {}, { title: '新增' }).then((res) => {
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
 * 编辑用户
 */
const handleEditUser = (_user) => {
  dynDialog.open(CompUserEditor, { userInfo: _user }, { title: '编辑' }).then((res) => {
    if (res.type === 'ok') {
      console.log('你点击了确定');
      refPagination.value?.triggerRefresh();
    } else {
      console.log('你点击了关闭');
    }
  });
};

/**
 * 批量删除用户
 */
const handleBatchDelUsers = () => {
  createConfirm('批量删除', `确定批量删除${unref(checkedUsersCount)}个用户？`, () => {
    return new Promise((resolve) => {
      const ids = keys(pickBy(unref(checkedUsers), (v) => v === true));

      UserController.userBatchDel({ ids }, 'message')
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
 * 批量管理权限
 */
const handleBatchMgtUserPermissions = () => {
  const ids = keys(pickBy(unref(checkedUsers), (v) => v === true));
  dynDialog.open(CompBatchMgtUserPermissions, { userIds: ids }, { title: '批量管理用户权限' }).then(({ type }) => {
    if (type === 'ok') refPagination.value?.triggerRefresh();
  });
};

/**
 * 重置用户密码
 */
const handleResetUserPwd = (user) => {
  if (unref(isSubmitting)) return;
  isSubmitting.value = true;

  UserController.userResetPassword({ id: user.id }, 'message')
    .then(() => {
      createNotification.success('重置', '重置成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

/**
 * 启用禁用用户
 * @param _user
 */
const handleEnableUser = (user) => {
  if (unref(isSubmitting)) return;
  isSubmitting.value = true;
  UserController.userBatchEnabled({ ids: [user.id], enabled: user.enabled }, 'message')
    .then(() => {
      createNotification.success('变更', '变更成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
/**
 * 删除用户
 */
const handleDelUser = (_user) => {
  UserController.userBatchDel({ ids: [_user.id] }, 'message')
    .then(() => {
      createNotification.success('删除', '删除成功');
      refPagination.value?.triggerRefresh();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

/**
 * 查询用户列表
 */
const queryUserList = async (params = {}, callback: Fn) => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  assignObj(searchField, params);
  queryStatus.value = queryStatusEnum.querying;
  try {
    const { list, total } = await UserController.userList(params, 'message');
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
