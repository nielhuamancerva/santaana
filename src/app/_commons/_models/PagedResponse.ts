export interface PagedResponse<T> {
    last: boolean;
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    content?: T[];
}