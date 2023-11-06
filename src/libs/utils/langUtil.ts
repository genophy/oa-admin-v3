import { cloneDeep, find, has } from 'lodash-es';
import { unref } from 'vue';
import { isArray, isEmpty, isNullOrUnDef } from '/@/libs/utils/is';

/**
 * 将树变成列表
 * @param tree
 * @param childrenName
 */
export const tree2list: any = (tree: any, fn: Fn = (_child, _parent) => {}, parent?: Nullable<any>, childrenName = 'children') => {
  const arr: any[] = [];

  if (isArray(tree)) {
    tree.forEach((item) => {
      arr.push(...tree2list(item, fn, parent, childrenName));
    });
  } else {
    let obj = cloneDeep(tree);
    obj = fn(obj, parent) || obj;
    if (obj[childrenName] && obj[childrenName].length > 0) {
      obj[childrenName].forEach((item) => {
        arr.push(...tree2list(item, fn, obj, childrenName));
      });
    }
    delete obj[childrenName];

    arr.push(obj);
  }

  return arr;
};

/**
 * 将树转换成列表，不包含 children
 * @param tree
 * @param childrenName
 */
export const tree2listWithoutChildren = (tree: any, parentName = 'parents', childrenName = 'children') => {
  return tree2list(tree, (child, parent) => {
    if (!parent) return null;
    //  除了父级子集，都缓存起来
    const _p = cloneDeep(parent);
    delete _p[childrenName];
    child[parentName] = [...(child[parentName] || []), _p];
    return child;
  });
};

/**
 *
 *递归树进行处理(注意内存共享问题)
 * @param {*} tree
 * @param {Fn} fn 执行方法 fn(child)
 * @param {*} parent 父级
 * @param {string} [childrenName='children'] 子集字段名
 * @param {boolean} [emptyChildren=false] 是否允许空子集，默认删除空子集
 * @return {*}
 */
export const recurseDealTree: any = (tree: any, fn: (_obj, _parent) => {}, parent: any = null, childrenName = 'children', emptyChildren = true) => {
  let obj = cloneDeep(tree);
  if (isArray(obj)) {
    return obj
      .map((child) => {
        return recurseDealTree(child, fn, childrenName);
      })
      .filter((item) => !!item);
  } else {
    if (obj[childrenName] && obj[childrenName].length > 0) {
      obj[childrenName] = recurseDealTree(obj[childrenName], fn, parent, childrenName, emptyChildren);
    } else if (emptyChildren) {
      delete obj[childrenName];
    }
    obj = fn(obj, parent);
    return obj;
  }
};

/**
 * 赋值对象，若新对象的值不为空，则直接替换
 * @param obj
 * @param newObjs
 * @returns
 */
export const assignObj = (obj: any, ...newObjs: any) => {
  Object.keys(obj).forEach((_key) => {
    newObjs.forEach((newObj) => {
      if (has(obj, _key) && has(newObj, _key) && newObj[_key] !== undefined && newObj[_key] !== null) {
        obj[_key] = newObj[_key];
      }
    });
  });
};

/**
 * 赋值对象，若新对象的值不为空，则直接替换
 * @param obj
 * @param newObj
 * @returns
 */
export const assignObjWitReturn = (obj: any, newObj: any) => {
  const obj2 = cloneDeep(unref(obj));
  const newObj2 = unref(newObj);
  Object.keys(obj2).forEach((_key) => {
    if (has(obj2, _key) && has(newObj2, _key) && newObj2[_key] !== undefined && newObj2[_key] !== null) {
      obj2[_key] = newObj2[_key];
    }
  });
  return obj2;
};

/**
 * 取数字范围
 *
 * num < min , return min
 * mum > max , return max
 * return num
 *
 * @param num
 * @param min
 * @param max
 * @returns
 */
export const minMax = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * 从列表中找出某个符合key值对应的元素的res值
 * @param value
 * @param list
 * @param keyName
 * @param resName
 * @param defaultValue
 * @returns
 */
export const listFind = (value, list: Array<any> = [], keyName = 'id', resName = 'name', defaultValue = '-') => {
  // 若未设置值，则返回默认值
  if (isNullOrUnDef(value) || value === '' || isEmpty(list) || !keyName || !resName) {
    return defaultValue;
  }
  const tmp: any = find(list, (item: any) => `${item[keyName]}` === `${value}`) || {};
  return tmp[resName] || defaultValue;
};

/**
 * 追加结尾
 * @param value
 * @param staff
 * @param total
 * @returns
 */
export const joinEnd = (value, staff, total) => {
  if (value && staff) {
    const sLen = `${staff}`.length;
    const len = total - sLen;
    return [`${value}`.slice(0, len), staff].join('');
  }
  return '';
};

 