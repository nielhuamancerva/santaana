export interface TareaModel{
    id?: string;
    user_created: string;
    user_asigned: string;
    title: string;
    description: string;
    expiration: string;
    completed: number;
    fl_enabled: number;
    fl_deleted: number;
}