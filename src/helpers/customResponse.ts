export class CustomResponse {
  static async customResponse(
    objs: any,
    pagination?: {
      totalItems: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
      sorting?: string;
    },
  ) {
    let response = {};

    const data = Array.isArray(objs)
      ? objs
      : [objs];

    response = {
      data: data,
    };

    if (pagination) {
      response = {
        ...response,
        meta: {
          pagination: {
            length: data.length,
            totalItems: pagination.totalItems,
            previousPage:
              pagination.currentPage !== 1
                ? pagination.currentPage - 1
                : null,
            currentPage: pagination.currentPage,
            nextPage:
              pagination.currentPage <
              pagination.totalPages
                ? pagination.currentPage + 1
                : null,
            pageSize: pagination.pageSize,
            totalPages: pagination.totalPages,
            sorting:
              pagination.sorting === 'asc'
                ? 'ascending'
                : 'descending',
          },
        },
      };
    }

    return response;
  }

  static async customResponseCursorPagination(
    objs: any,
    pagination?: {
      totalItems: number;
      cursorId: number | null | undefined;
      pageSize: number | undefined;
      totalPages: number;
      sorting?: string;
    },
  ) {
    let response = {};

    const data = Array.isArray(objs)
      ? objs
      : [objs];

    response = {
      data: data,
    };

    if (pagination) {
      const lastItem = data[data.length - 1];
      response = {
        ...response,
        meta: {
          pagination: {
            length: data.length,
            totalItems: pagination.totalItems,
            nextPageCursor: lastItem
              ? lastItem.id
              : null,
            pageSize: pagination.pageSize,
            totalPages: Math.ceil(
              pagination.totalItems /
                (pagination.pageSize || 10),
            ),
            sorting:
              pagination.sorting === 'asc'
                ? 'ascending'
                : 'descending',
          },
        },
      };
    }

    return response;
  }
}
