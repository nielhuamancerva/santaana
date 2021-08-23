export interface ApiResponse<T> {
    success: boolean;
    timestamp: string;
    message: string;
    data?: T;
}