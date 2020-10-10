import {
  Repository,
  FindConditions,
  FindManyOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { Pagination } from './pagination';
import { IPaginationOptions } from './interfaces';

function createPaginationObject<T>(
  data: T[],
  total: number,
  currentPage: number,
  perPage: number,
) {
  const lastPage = Math.ceil(total / perPage);

  return new Pagination(
    data,
    {
      total,
      perPage,
      lastPage,
      currentPage,
    },
  );
}

function resolveOptions(options: IPaginationOptions): [number, number] {
  const page = options.page;
  const perPage = options.perPage;

  return [page, perPage];
}

export async function paginateRepository<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindConditions<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, perPage] = resolveOptions(options);

  const [data, total] = await repository.findAndCount({
    skip: perPage * (page - 1),
    take: perPage,
    ...searchOptions,
  });

  return createPaginationObject<T>(data, total, page, perPage);
}

export async function paginateQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, perPage] = resolveOptions(options);

  const [data, total] = await queryBuilder
    .take(perPage)
    .skip((page - 1) * perPage)
    .getManyAndCount();

  return createPaginationObject<T>(data, total, page, perPage);
}
