import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import {
    MatRippleModule,
    MatNativeDateModule
} from '@angular/material/core';

import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CoreModule } from '../../../_metronic/core';
import { GeneralModule } from '../../../_metronic/partials/content/general/general.module';
import { InlineSVGModule } from 'ng-inline-svg';

import { AsignInternalUserComponent } from './asign-internal-user.component';
import { AsignInternalUsersRoutingModule } from './asign-internal-user-routing.module';
import { EditAsignInternalUserComponent } from './edit-asign-internal-user/edit-asign-internal-user.component';
import { ListAsignInternalUserComponent } from './list-asign-internal-user/list-asign-internal-user.component';
import { CreateAsignInternalUserComponent } from './create-asign-internal-user/create-asign-internal-user.component';
import { ModalUploadFileComponent } from './modal-upload-file/modal-upload-file.component';

@NgModule({
    declarations: [
        AsignInternalUserComponent,
        EditAsignInternalUserComponent,
        ListAsignInternalUserComponent,
        CreateAsignInternalUserComponent,
        ModalUploadFileComponent
    ],
    imports: [
        CommonModule,
        AsignInternalUsersRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbModalModule,
        NgbDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatListModule,
        MatSliderModule,
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatMenuModule,
        MatTabsModule,
        MatTooltipModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule,
        MatGridListModule,
        MatToolbarModule,
        MatBottomSheetModule,
        MatExpansionModule,
        MatDividerModule,
        MatSortModule,
        MatStepperModule,
        MatChipsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatRippleModule,
        CoreModule,
        MatRadioModule,
        MatTreeModule,
        MatButtonToggleModule,
        GeneralModule
    ]
})

export class AsignInternalUserModule {}