import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AgentsComponent } from "./agents/agents.component";
import { BeneficiariesComponent } from "./beneficiaries/beneficiaries.component";
import { BoxSquareComponent } from "./boxsquare/boxsquare.component";
import { BoxSquaresComponent } from "./boxsquares/boxsquares.component";
import { BoxSquaresMeComponent } from "./boxsquaresme/boxsquaresme.component";
import { DocumentsComponent } from "./documents/documents.component";
import { PaymentComponent } from "./payment/payment.component";
import { PaymentsComponent } from "./payments/payments.component";
import { UsersComponent } from "./users/users.component";
import { TaskComponent } from "./task/task.component";
import { TasksComponent } from './task/tasks/tasks.component';
import { NotesComponent } from './task/notes/notes.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'agents',
                component: AgentsComponent
            },
            {
                path: 'beneficiaries',
                component: BeneficiariesComponent
            },
            {
                path: 'documents',
                component: DocumentsComponent
            },
            {
                path: 'payment',
                component: PaymentComponent
            },
            {
                path: 'payments',
                component: PaymentsComponent
            },
            {
                path: 'boxsquares',
                component: BoxSquaresComponent
            },
            {
                path: 'boxsquare',
                component: BoxSquareComponent
            },
            {
                path: 'boxsquareme',
                component: BoxSquaresMeComponent
            },
            {
                path: 'taks',
                component: TaskComponent
            },
            {
                path: 'taks/tak',
                component: TasksComponent
            }
            ,
            {
                path: 'taks/notes',
                component: NotesComponent
            },
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: '**', redirectTo: 'users', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }