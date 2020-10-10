export interface IPaginationOptions {
  perPage: number;
  page: number;
}

export interface IPaginationMeta {
  total: number;
  perPage: number;
  lastPage: number;
  currentPage: number;
}
