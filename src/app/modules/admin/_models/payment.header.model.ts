import { PaymentModel } from './payment.model';
import { BeneficiaryModel } from './Beneficiary.model';
export class PaymentHeaderModel {
    id?: string;
    received?: number;
    paid?: number;
    returned?: number;
    payDate?: string;
    _payDate?: string;
    note?: string;
    canal?: string;
    canalCode?: string;
    version?: string;
    latitude?: string;
    longitude?: string;
    enabled?: string;
    beneficiary?: BeneficiaryModel;
    payments?: PaymentModel[];
    files?: string[];
    documents?: string[];
}