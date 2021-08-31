import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksComponent } from './tasks/tasks.component';
import { NotesComponent } from './notes/notes.component';
import { TaskComponent } from './task.component';
import { TasksRoutingModule } from './task-routing.module';



@NgModule({
  declarations: [
    TaskComponent,
    TasksComponent, 
    NotesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TasksRoutingModule
  ]
})
export class TaskModule { }
