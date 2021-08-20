import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { UserOffcanvasComponent } from './offcanvas/user-offcanvas/user-offcanvas.component';
import { CoreModule } from '../../../core';

import { EditProfileModalComponent } from './offcanvas/user-offcanvas/edit-profile-modal/edit-profile-modal.component';
import { ResetPasswordModalComponent } from './offcanvas/user-offcanvas/reset-password-modal/reset-password-modal.component';
import { CRUDTableModule } from '../../../../_metronic/shared/crud-table';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    UserOffcanvasComponent,
    EditProfileModalComponent,
    ResetPasswordModalComponent
  ],
  imports: [
    CommonModule, 
    InlineSVGModule, 
    PerfectScrollbarModule, 
    CoreModule, RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CRUDTableModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  exports: [
    UserOffcanvasComponent,
  ],
  entryComponents: [
    EditProfileModalComponent,
    ResetPasswordModalComponent
  ]
})
export class ExtrasModule { }
