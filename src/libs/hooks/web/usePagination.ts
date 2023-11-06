import { computed, Ref, ref, unref } from 'vue';

function pagination<T = any>(list: T[], pageIndex: number, pageSize: number): T[] {
  const offset = pageIndex * Number(pageSize);
  const ret = offset + Number(pageSize) >= list.length ? list.slice(offset, list.length) : list.slice(offset, offset + Number(pageSize));
  return ret;
}

export function usePagination<T = any>(list: Ref<T[]>, pageSize: number) {
  const currentPage = ref(1);
  const pageSizeRef = ref(pageSize);

  const getPaginationList = computed(() => {
    return pagination(unref(list), unref(currentPage), unref(pageSizeRef));
  });

  const getTotal = computed(() => {
    return unref(list).length;
  });

  const getTotalPage = computed(() => {
    return Math.ceil(getTotal.value / unref(pageSizeRef));
  });

  const isFirstPage = computed(() => {
    return unref(currentPage) <= 1;
  });

  const isLastPage = computed(() => {
    return unref(getTotalPage) <= unref(currentPage);
  });

  function setCurrentPage(page: number) {
    currentPage.value = page;
  }

  function setPageSize(pageSize: number) {
    pageSizeRef.value = pageSize;
  }
  return { setCurrentPage, getTotal, getTotalPage, setPageSize, getPaginationList, isFirstPage, isLastPage };
}

/**
 * 数据分页
 * @param pageSize
 */
export function useQueryPagination(_pageSize = 10) {
  const pageIndex = ref(1); // 当前页
  const pageSize = ref(_pageSize);
  const total = ref(0); //记录总数
  const getPageIndex = computed(() => unref(pageIndex));

  const getPageSize = computed(() => unref(pageSize));

  // 总页数
  const getPageTotal = computed(() => Math.max(1, Math.ceil(unref(total) / unref(pageSize))));

  // 总记录数
  const getTotal = computed(() => unref(total));

  const isFirstPage = computed(() => {
    if (unref(pageIndex) <= 1) {
      pageIndex.value = 1;
      return true;
    }
    return false;
  });

  const isLastPage = computed(() => {
    if (unref(getPageTotal) <= unref(pageIndex)) {
      pageIndex.value = unref(getPageTotal);
      return true;
    }
    return false;
  });

  function setPageIndex(index: number) {
    pageIndex.value = index;
  }

  function setPageSize(_pageSize: number) {
    pageSize.value = _pageSize;
  }

  function setTotal(_total: number) {
    total.value = _total;
  }

  function prev() {
    if (!isFirstPage.value) pageIndex.value--;
    return unref(pageIndex);
  }

  function next() {
    if (!isLastPage.value) pageIndex.value++;
    return unref(pageIndex);
  }

  function reset(...fields: Array<'pageIndex' | 'pageSize' | 'total'>) {
    if (fields.length > 0) {
      if (~fields.indexOf('pageIndex')) {
        pageIndex.value = 0;
      }
      if (~fields.indexOf('pageSize')) {
        pageSize.value = 1;
      }
      if (~fields.indexOf('total')) {
        total.value = 1;
      }
    } else {
      pageIndex.value = 0;
      pageSize.value = _pageSize;
      total.value = 0;
    }
  }

  function joinParams(condition = {}, order = {}, cache = false) {
    return {
      pageIndex: unref(pageIndex),
      pageSize: unref(getPageSize),
      condition,
      order,
      cache,
    };
  }

  return { getPageIndex, getPageSize, getPageTotal, getTotal, isFirstPage, isLastPage, prev, next, setPageIndex, setPageSize, setTotal, reset, joinParams };
}
