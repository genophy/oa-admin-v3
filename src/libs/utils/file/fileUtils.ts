import SparkMD5 from 'spark-md5';

export class FileUtils {
  static blobSlice = File.prototype.slice || (File.prototype as any).mozSlice || (File.prototype as any).webkitSlice;

  /**
   * 计算文件 md5
   *
   * @static
   * @param {*} file
   * @param {number} [chunkSize=1024 * 1024 * 2] 2MB  若是单个文件则是 0
   * @type {*}
   * @memberof FileUtils
   */
  static calcFileMd5: any = (file, chunkSize = 1024 * 1024 * 2) => {
    if (!chunkSize) chunkSize = file.size;
    return new Promise((resolve, reject) => {
      const chunkTotal = Math.ceil(file.size / chunkSize);
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();

      let currentChunk = 0;

      fileReader.onload = (e: any) => {
        spark.append(e.target.result); // Append array buffer
        currentChunk++;

        if (currentChunk < chunkTotal) {
          loadNext();
        } else {
          const fileHex = spark.end();
          resolve(fileHex);
        }
      };

      fileReader.onerror = (e) => {
        console.warn('oops, something went wrong.');
        reject(e);
      };

      function loadNext() {
        const start = currentChunk * chunkSize;
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(FileUtils.blobSlice.call(file, start, end));
      }

      loadNext();
    });
  };

  /**
   * 获取上传数据
   * @param file
   */
  static splitFileData = async (file, chunkSize = 1024 * 1024 * 2) => {
    const blockCount = Math.ceil(file.size / chunkSize); // 分片总数
    const dataArr: any = []; // axiosPromise数组
    const fileHex = await FileUtils.calcFileMd5(file, chunkSize);

    for (let i = 0; i < blockCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const fileBlob = FileUtils.blobSlice.call(file, start, end);
      dataArr.push({ file: fileBlob, fileName: file.name, fileSize: file.size, chunkIndex: i, chunkTotal: blockCount, fileHex, type: file.type || 'file' });
    }
    return dataArr;
  };

  /**
   * 上传已经分割的数据
   * @param promiseFn
   * @param splitFileDataArr
   * @param params
   * @param progress
   */
  static async uploadSplitFileData(promiseFn: Promise<any> | any, splitFileDataArr, params = {}, progress = (_percent) => {}) {
    const totalLoadedArr: number[] = [];
    const fileSize = splitFileDataArr[0]?.fileSize;
    const axiosPromiseArray = splitFileDataArr.map((item, idx) => {
      return promiseFn(
        Object.assign(item, params),
        ({ loaded }) => {
          totalLoadedArr[idx] = loaded;
          const totalLoaded = totalLoadedArr.reduce((a, b) => a + b);
          const percent = Math.floor((totalLoaded / fileSize) * 100);
          progress(percent);
        },
        'none',
        { isTransformResponse: true },
      );
      // .then((data) => {
      //   if (data.code !== 0) {
      //     throw data;
      //   }
      // });
    });
    return Promise.all(axiosPromiseArray).then((arr) => {
      return arr.filter((i) => i.complete)[0];
    });
  }

  /**
   * 上传大文件,
   * 一次性上传
   * @param fn
   * @param file
   */
  static async uploadBigFile(promiseFn: Promise<any> | any, file, params = {}, progress = (_percent) => {}): Promise<any> {
    const splitFileDataArr: any = await FileUtils.splitFileData(file);

    return FileUtils.uploadSplitFileData(promiseFn, splitFileDataArr, params, progress);
  }
}
