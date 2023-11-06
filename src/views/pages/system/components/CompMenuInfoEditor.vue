<template>
  <!--  -->
  <div v-loading="isQuerying" class="flex flex-col c__menu-info-editor relative">
    <el-form ref="refForm" class="flex flex-col overflow-hidden" :model="formField" :rules="formRules" label-width="80px" @keypress.enter="handleSubmit(refForm)">
      <el-empty v-if="!isAdd && (!menu || !menu.id)" description="未选择菜单" />
      <template v-else>
        <div class="flex-1 py-2 px-6 overflow-auto">
          <el-form-item label="类型" prop="type">
            <!-- level  目录 菜单路由 外链 -->
            <el-radio-group v-model="formField.type">
              <el-radio label="FOLDER" :border="true" class="mb-1">目录</el-radio>
              <el-radio label="ROUTE" :border="true" class="mb-1">菜单</el-radio>
              <el-radio label="REDIRECT" :border="true" class="mb-1">外链</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上级" prop="parentId">
            <el-cascader
              v-if="pageLoaded"
              v-model="formField.parentId"
              :options="parentMenusTree"
              class="w-full"
              clearable
              :props="{ label: 'name', value: 'id', checkStrictly: true, expandTrigger: 'hover', emitPath: false }"
            />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="formField.name" maxlength="200" class="w-full" clearable />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <BaseIconPicker v-model="formField.icon" class="w-full" clearable />
          </el-form-item>
          <el-form-item v-if="formField.type === 'ROUTE'" label="路由" prop="url">
            <el-autocomplete
              v-model="formField.url"
              :fetch-suggestions="filterRouteUrl"
              popper-class="my-autocomplete"
              clearable
              placeholder="请输入路由地址"
              class="w-full"
              @select="handleChooseHref"
            >
              <template #default="{ item }">
                <div class="value">{{ item }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item v-if="formField.type === 'REDIRECT'" label="外链" prop="url">
            <el-input v-model="formField.url" maxlength="200" class="w-full" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sorting">
            <BaseInputNumber v-model="formField.sorting" :precision="0" :min="1" :max="999" />
          </el-form-item>
          <div class="px-8">
            <ButtonPermissionsCard :menu-url="formField.url" class="mb-8" />
          </div>
        </div>
        <div class="flex flex-shrink-0 px-4 pt-4 justify-end">
          <el-button v-if="delAble" type="danger" class="mr-6" @click="handleDel"> <BaseIcon icon="ion-trash" /> 删除</el-button>
          <el-button type="primary" @click="handleSubmit(refForm)"> <BaseIcon icon="ion-checkmark" /> 保存</el-button>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { cloneDeep, uniq } from 'lodash-es';
import { onMounted, reactive, ref, unref, watch } from 'vue';
import { MenuController } from '/@/api/controllers/menu.controller';
import BaseIcon from '/@/components-base/BaseIcon';
import BaseIconPicker from '/@/components-base/BaseIcon/src/BaseIconPicker.vue';
import ButtonPermissionsCard from '/@/components/ButtonPermissionGroup/ButtonPermissionsCard.vue';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { MainRoute } from '/@/libs/router/routes';
import { recurseDealTree, tree2list } from '/@/libs/utils/langUtil';
import { propTypes } from '/@/libs/utils/propTypes';
import BaseInputNumber from '/@/components-base/BaseInput/BaseInputNumber.vue';

const { createConfirm, createNotification } = useMessage();

const props = defineProps({
  isAdd: propTypes.bool.def(false),
  menu: {
    type: Object,
    default: () => {},
  },
  delAble: propTypes.bool.def(false),
});

const refForm = ref<FormInstance>();

const isQuerying = ref(false);
const pageLoaded = ref(false);

// 所有路由地址
const urlList: any[] = uniq(
  tree2list(MainRoute, (item, parent) => {
    item.fullPath = [parent?.fullPath || parent?.path || '', item.path].filter((v) => !!v).join('/');
    return item;
  }).map((item) => {
    return item.fullPath;
  }),
).sort();

const formField = ref({
  id: '',
  parentId: '',
  name: '',
  icon: '',
  url: '',
  type: 'FOLDER', // 类型  'FOLDER', 'ROUTE', 'REDIRECT'  button
  sorting: 1,
  children: [],
} as any);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入路由', trigger: 'blur' }],
});

// 动态校验
// const dynamicRules = reactive<FormRules>({
//   children: [{ validator: validateBtnPermission, trigger: 'blur' }],
// });

/**
 * 父级菜单，过滤禁用掉所有button
 */

const parentMenusTree = ref([]);

const emits = defineEmits(['ok', 'cancel']);

// 过滤路由地址
const filterRouteUrl = (queryString: string, cb: any) => {
  const results = queryString ? urlList.filter((item) => ~item.toLowerCase().indexOf(queryString.toLowerCase())) : urlList;
  // call callback function to return suggestions
  cb(results);
};
/**
 * 选择路由地址
 */
const handleChooseHref = (_url) => {
  formField.value.url = _url;
};

/**
 * 删除菜单
 */
const handleDel = () => {
  createConfirm('删除菜单', `确定删除此菜单${props.menu.name}?`, () => {
    return doDelMenu(unref(formField));
  });
};

/**
 * 提交
 */
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      createConfirm('提交', `确定提交?`, () => {
        if (formField.value.id) {
          // 编辑
          return doEditMenu(unref(formField));
        } else {
          // 新增
          return doAddMenu(unref(formField));
        }
      }).then((_action) => {});

      console.log('submit suggest');
    } else {
      console.error('error: ', fields);
      formEl.scrollToField(Object.keys(fields || {})[0]);
      return false;
    }
  });
};

const doEditMenu = async (params) => {
  return MenuController.menuUpdate(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    // 发送重新获取菜单
    fetchMenu();
    emits('ok', 'edit');
  });
};

const doAddMenu = async (params) => {
  return MenuController.menuAdd(params, 'message').then(() => {
    createNotification.success('提交', '提交成功');
    // 发送重新获取菜单
    fetchMenu();
    emits('ok', 'add');
  });
};

const doDelMenu = async (params) => {
  return MenuController.menuBatchDel({ ids: [params.id] }, 'message').then(() => {
    createNotification.success('刪除', '刪除成功');
    // 发送重新获取菜单
    fetchMenu();
    emits('ok', 'del');
  });
};

/**
 * 查询菜单
 */
const fetchMenu = () => {
  isQuerying.value = true;
  pageLoaded.value = false;
  return MenuController.menuTreeAll({}, 'message')
    .then((treeData) => {
      parentMenusTree.value = recurseDealTree(treeData, (item) => {
        if (item.id === props.menu.id || item.type === 'ROUTE' || item.type === 'REDIRECT') {
          item.disabled = true;
        }
        if (item.children) item.children = item.children.filter((cItem) => cItem.type === 'FOLDER'); //|| cItem.type !== 'REDIRECT');
        return item;
      });
    })
    .finally(() => {
      isQuerying.value = false;
      pageLoaded.value = true;
    });
};

watch(
  () => props.menu,
  (v) => {
    let _menu: any = {};
    if (v) {
      _menu = cloneDeep(props.menu);
      _menu.children = (_menu.children || []).filter((item) => item.type === 'REDIRECT');
      if (fetchMenu) fetchMenu();
    }
    Object.assign(formField.value, _menu);
    refForm?.value?.clearValidate();
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  fetchMenu();
});
</script>

<style scoped lang="scss"></style>
