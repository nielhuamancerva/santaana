import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { ListUserComponent } from './components/list-user/list-user.component';
import {EditUserModalComponent} from './components/edit-user-modal/edit-user-modal.component';
import {WidgetsModule} from '../../_metronic/partials/content/widgets/widgets.module';
import {DropdownMenusModule} from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { UsersRoutingModule } from './users-routing.module';


@NgModule({
  declarations: [ListUserComponent,
    EditUserModalComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CRUDTableModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    UsersRoutingModule,
    DropdownMenusModule,
    NgbDropdownModule,
    NgbTooltipModule,
    WidgetsModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  entryComponents: [
    EditUserModalComponent
  ]
})
export class UsersModule { }
