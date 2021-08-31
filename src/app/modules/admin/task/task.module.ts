import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    TasksRoutingModule
  ]
})
export class TaskModule { }
