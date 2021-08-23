import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { PaymentManagementComponent} from './payment-management.component';
import { PaymentComponent} from './payment/payment.component';
import { PaymentListComponent } from './payment/payment-list/payment-edit.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentManagementComponent,
        children: [
        {
            path: 'payment',
            component: PaymentComponent,
        },
        {
            path: 'payment/list',
            component: PaymentListComponent
        },
        { path: '', redirectTo: 'payment', pathMatch: 'full' },
        { path: '**', redirectTo: 'payment', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class PaymentManagementRoutingModule { }