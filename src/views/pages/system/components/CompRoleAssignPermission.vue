<!--
  FileDesc  : CompRoleAssignPermission
  path      : src/views/pages/system/components/CompRoleAssignPermission.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="flex flex-col min-h-60 v-comp-role-assign-permission overflow-hidden">
    <div class="flex-grow grid px-8 gap-4 grid-cols-2 overflow-hidden">
      <div class="flex flex-col overflow-hidden">
        <ElDivider content-position="left" class="flex-shrink-0">
          <span class="text-xs">菜单</span>
        </ElDivider>

        <el-scrollbar ref="refMenuContainer" class="flex-grow overflow-auto">
          <el-tree
            ref="refTree"
            :data="menus"
            :default-expand-all="true"
            :default-expanded-keys="selectedMenuIds"
            :default-checked-keys="selectedMenuIds"
            node-key="id"
            highlight-current
            show-checkbox
            :expand-on-click-node="false"
            :check-strictly="true"
            :props="{ children: 'children', label: 'name' }"
            @node-click="selectedMenu = $event"
            @check="handleMenuCheck"
          />
          <div class="h-10"> </div>
        </el-scrollbar>
        <div class="flex justify-start items-center">
          <ElButton size="small" @click="checkAllTree(refTree, false)">清空</ElButton>
          <ElButton type="warning" size="small" @click="checkAllTree(refTree, true)">全选</ElButton>
        </div>
      </div>
      <div>
        <ElDivider content-position="left">
          <span class="text-xs">按钮</span>
        </ElDivider>
        <div v-if="selectedMenu && selectedMenu.id && selectedMenu.type === 'ROUTE'">
          <ButtonPermissionsCheckbox :button-permissions="buttonPermissions" :menu="selectedMenu" @permission-change="buttonPermissions = $event" />
        </div>
        <ElEmpty v-else description="请选择菜单" />
      </div>
    </div>
    <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
      <el-button class="mr-6" @click="handleClose"> <BaseIcon icon="ion-close-circle-outline" /> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> <BaseIcon icon="ion-checkmark" /> 提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, UnwrapRef, computed, onMounted, ref, unref } from 'vue';
import { MenuController, RoleController } from '/@/api';
import ButtonPermissionsCheckbox from '/@/components/ButtonPermissionGroup/ButtonPermissionsCheckbox.vue';
import { queryStatusEnum } from '/@/libs/enums/paginationEnum';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { recurseDealTree, tree2list, tree2listWithoutChildren } from '/@/libs/utils/langUtil';
import { propTypes } from '/@/libs/utils/propTypes';
import { MainRoute } from '/@/libs/router/routes';
import BaseIcon from '/@/components-base/BaseIcon';

const { createConfirm, createNotification } = useMessage();

const refTree = ref();

// 查询状态（界面按钮使用）
const queryStatus: Ref<queryStatusEnum> = ref(queryStatusEnum.ready);

const props = defineProps({
  role: propTypes.object.def({}),
});

const emits = defineEmits(['ok', 'cancel']);

// 角色所拥有的按钮权限
const buttonPermissions = ref(props.role.buttonPermissions || '');

const menus: any = ref([]); // 菜单树
const menusSeq: any = computed(() => tree2listWithoutChildren(unref(menus)));

const isAdminOnlyMenuUrls: Ref<UnwrapRef<any[]>> = ref([]); // 所有管理员专属的菜单

const selectedMenuIds = ref(props.role.menus.map((i) => i.id));
const selectedMenu: any = ref({});

/**
 * 全选 or 反选选择树
 * @param refTree
 * @param flag
 */
const checkAllTree = (refTree, flag) => {
  const checkedKeys = flag ? unref(menusSeq).map((item) => item.id) : [];
  refTree.setCheckedKeys(checkedKeys);
  updateMenuTreeIds(checkedKeys);
};

/**
 * 菜单树选择
 * @param _cur
 * @param obj
 */
const handleMenuCheck = (_cur, obj) => {
  const { checkedKeys } = obj;
  updateMenuTreeIds(checkedKeys);
};

/**
 * 设置选择的菜单ids
 * @param ids
 */
const updateMenuTreeIds = (ids) => {
  selectedMenuIds.value = ids;
};

/**
 * 查询管理员权限的菜单树
 */
const fetchAdminMenu = () => {
  if (unref(queryStatus) === queryStatusEnum.querying) return;
  queryStatus.value = queryStatusEnum.querying;

  return MenuController.menuTreeAll({}, 'message')
    .then((treeData) => {
      menus.value = recurseDealTree(treeData, (item, _parent) => {
        // 过滤掉所有仅管理员菜单
        if (!!~unref(isAdminOnlyMenuUrls).indexOf(item.url)) return null;
        return item;
      });
    })
    .finally(() => {
      queryStatus.value = unref(menus).length > 0 ? queryStatusEnum.finish : queryStatusEnum.empty;
    });
};

/**
 * 关闭当前弹框
 */
const handleClose = () => emits('cancel', false);
/**
 * 提交
 */
const handleSubmit = () => {
  createConfirm('提交', `确定提交?`, () => {
    return RoleController.roleAssignPermission({ id: props.role.id, menuIds: unref(selectedMenuIds), buttonPermissions: unref(buttonPermissions) }, 'message').then(() => {
      createNotification.success('提交', '提交成功');
      emits('ok', true);
    });
  });
};

/**
 * 加载
 */
onMounted(() => {
  isAdminOnlyMenuUrls.value = tree2list(MainRoute, (item, parent) => {
    item.fullPath = [parent?.fullPath || parent?.path || '', item.path].filter((v) => !!v).join('/');
    return item;
  })
    .filter((item) => item.meta.adminOnly)
    .map((item) => {
      return item.fullPath;
    });

  fetchAdminMenu();

  // 所有管理员专属的菜单无法分配
});
</script>

<style scoped lang="scss"></style>
