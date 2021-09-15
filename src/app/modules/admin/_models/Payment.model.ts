import { DocumentModel } from './Document.model';
export class PaymentModel {
    id?: string;
    migration?: number;
    paidout?: number;
    enabled?: string;
    document?: DocumentModel;
}

