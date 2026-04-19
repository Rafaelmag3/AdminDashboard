export interface PaginatedResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PageChangeEvent {
    page: number;
    limit: number;
}
