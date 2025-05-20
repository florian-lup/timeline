/**
 * Small helper for reading `page` / `limit` search params
 * and computing the MongoDB skip-value.
 */
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(searchParams: URLSearchParams, defaultLimit = 12): PaginationParams {
  const limit = parseInt(searchParams.get('limit') ?? String(defaultLimit), 10);
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
