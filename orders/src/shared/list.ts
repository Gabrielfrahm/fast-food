export interface List<E> {
  data: E[];
  meta: {
    page: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}
