import { IPaginationMeta } from './interfaces';

export class Pagination<PaginationObject> {
  constructor(
    public readonly data: PaginationObject[],
    public readonly meta: IPaginationMeta,
  ) {}
}
