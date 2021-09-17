import { UserModel } from "./user.model";

export interface TareaModel{
    id?: string;
    user_created?: UserModel;
    user_asigned?: UserModel;
    title: string;
    description: string;
    expiration: string;
    completed: number;
    fl_enabled: number;
    fl_deleted: number;
    asigned_id:string;
}



