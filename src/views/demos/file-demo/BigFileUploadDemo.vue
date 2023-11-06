<!--
  FileDesc  : BigFileUploadDemo
  path      : src/demos/big-file/BigFileUploadDemo.vue
  Author    : genophy
  Version   :
  Usage     :
-->
<template>
  <div class="v-big-file-upload-demo">
    <div>
      <ElButton @click="handleQuery">查看文件列表</ElButton>
      <ElButton @click="handleDelAll">删除所有文件</ElButton>
    </div>
    <div>
      <div v-for="item in fileList" :key="item"
        >{{ item }}
        <span class="ml-8 px-2" @click="handleDel(item)">[del]</span>
      </div>
    </div>
    <div>
      <BaseVideoUploader ref="refVideoUploader" label="请上传视频" accept-type="video/*" segment-size="20M" />
    </div>

    <div class="my-8">
      <ElInput v-model="file1Hex" placeholder="文件hash(md5)" clearable />

      <div class="my-8"> <BaseFileDownloadCard v-model="file1Hex" show-info /> </div>
      <div class="my-8"> <BaseFileDownloadCard v-model="file1Hex" show-info direct="right" /> </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue';
import { FileStoreController } from '/@/api';
import BaseVideoUploader from '/@/components-base/BaseFile/BaseVideoUploader.vue';
import BaseFileDownloadCard from '/@/components-base/BaseFile/BaseFileDownloadCard.vue';
import { onMounted } from 'vue';

const file1Hex = ref('');

const fileList = ref([]);

const handleQuery = () => {
  FileStoreController.fileStoreList().then(({ list }) => {
    fileList.value = list.map((item) => item.fileHex);
    file1Hex.value = unref(fileList)[0];
  });
};

const handleDel = async (fileHex) => {
  await FileStoreController.delete_fileStore(fileHex);

  handleQuery();
};
const handleDelAll = () => {
  FileStoreController.fileStoreDelAll();
};

onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss"></style>
