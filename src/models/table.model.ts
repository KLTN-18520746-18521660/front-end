export interface SortMeta {
  field: string;
  order: number;
}

export interface TableData {
  filters?: {
    [key: string]: [
      {
        value?: string;
        matchMode?: string;
        operator?: string;
      }
    ];
  };
  first?: number;
  globalFilter?: string;
  multiSortMeta?: SortMeta[];
  rows?: number;
  sortField?: string;
  sortOrder?: number;
}

export interface QueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  orderBy?: string;
}