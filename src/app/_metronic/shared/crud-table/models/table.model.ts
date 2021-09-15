import { GroupingState } from './grouping.model';
import { PaginatorState } from './paginator.model';
import { SortState } from './sort.model';

export interface ITableState {
  filter: {};
  paginator: PaginatorState;
  sorting: SortState;
  searchTerm: string;
  searchAux1?: string;
  searchAux2?: string;
  searchAux3?: string;
  searchAux4?: string;
  searchAux10?: any;

  grouping: GroupingState;
  entityId: number | undefined;
}

export interface TableResponseModel<T> {
  items: T[];
  total: number;
  lenght?: number;
}

export interface ICreateAction {
  create(): void;
}

export interface IEditAction {
  edit(id: any): void;
}

export interface IDeleteAction {
  delete(id: any): void;
}

export interface IDeleteSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  deleteSelected(): void;
}

export interface IFetchSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  fetchSelected(): void;
}

export interface IUpdateStatusForSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  updateStatusForSelected(): void;
}

