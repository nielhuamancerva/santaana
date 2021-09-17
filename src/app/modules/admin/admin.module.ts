import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModalModule, NgbDatepickerModule, NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { InlineSVGModule } from "ng-inline-svg";
import { CRUDTableModule } from "./../../_metronic/shared/crud-table";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UsersComponent } from "./users/users.component";


import {
  MatRippleModule,
} from '@angular/material/core';


import { AgentsComponent } from "./agents/agents.component";
import { EditAgentModalComponent } from "./agents/components/edit-agent-modal/edit-agent-modal.component";
import { EditUserModalComponent } from "./users/components/edit-user-modal/edit-user-modal.component";
import { HasherUserModalComponent } from "./users/components/hasher-user-modal/hasher-user-modal.component";
import { HasherAgentModalComponent } from "./agents/components/hasher-agent-modal/hasher-agent-modal.component";
import { BeneficiariesComponent } from "./beneficiaries/beneficiaries.component";
import { DocumentsComponent } from "./documents/documents.component";
import { PaymentComponent } from "./payment/payment.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { TicketPaymentModalComponent } from "./payment/components/ticket-payment-modal.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { PaymentsComponent } from "./payments/payments.component";
import { BoxSquaresComponent } from "./boxsquares/boxsquares.component";
import { BoxSquareComponent } from "./boxsquare/boxsquare.component";
import { BoxSquaresMeComponent } from "./boxsquaresme/boxsquaresme.component";
import { EditBoxSquareModalComponent } from "./boxsquares/components/edit-boxsquare-modal.component";
import { TaskComponent } from "./task/task.component";
import { NotesComponent } from './notes/notes.component';
import { ModalNoteComponent } from "./notes/components/modal-notes.component";
import { ModalTaskComponent } from "./task/components/modal-tasks.component";
import { UbigeoComponent } from "./ubigeo/ubigeo.component";
import { CreateUbigeoComponent } from "./ubigeo/components/create-ubigeo/create-ubigeo.component";
import { MatSelectModule } from "@angular/material/select";
import { ModalUploadFileComponent } from "./ubigeo/components/modal-upload-file/modal-upload-file.component";

@NgModule({
    declarations: [
        AdminComponent,
        UsersComponent,
        EditUserModalComponent,
        AgentsComponent,
        EditAgentModalComponent,
        HasherUserModalComponent,
        HasherAgentModalComponent,
        BeneficiariesComponent,
        DocumentsComponent,
        PaymentComponent,
        TicketPaymentModalComponent,
        PaymentsComponent,
        BoxSquaresComponent,
        BoxSquareComponent,
        BoxSquaresMeComponent,
        EditBoxSquareModalComponent,
        TaskComponent,
        NotesComponent,
        ModalNoteComponent,
        ModalTaskComponent,
        UbigeoComponent,
        CreateUbigeoComponent,
        ModalUploadFileComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        AdminRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CRUDTableModule,
        InlineSVGModule,
        NgbModalModule,
        NgbDatepickerModule,
        TranslateModule,
        MatTabsModule,
        MatAutocompleteModule,
        NgbAlertModule,
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        MatDatepickerModule,
        MatDialogModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,
    ],
    entryComponents: [
        EditUserModalComponent,
        EditAgentModalComponent,
        HasherUserModalComponent,
        HasherAgentModalComponent,
        BeneficiariesComponent,
        DocumentsComponent,
        TicketPaymentModalComponent,
        EditBoxSquareModalComponent,
        ModalNoteComponent,
        ModalTaskComponent,
        ModalUploadFileComponent
    ]
})
export class AdminModule { }