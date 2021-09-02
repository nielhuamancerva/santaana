import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InlineSVGModule } from 'ng-inline-svg';
import {
  MatRippleModule,
  MatNativeDateModule
} from '@angular/material/core';

import { TasksRoutingModule } from './task-routing.module';
import { ModalTaskComponent } from './tasks/modal-task/modal-task.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotesComponent } from './notes/notes.component';
import { TaskComponent } from './task.component';
import { ModalNoteComponent } from './notes/modal-note/modal-note.component';



@NgModule({
  declarations: [
    TaskComponent,
    TasksComponent, 
    NotesComponent, 
    ModalTaskComponent, ModalNoteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    InlineSVGModule,
    TasksRoutingModule
  ]
})
export class TaskModule { }
