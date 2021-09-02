import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { TaskComponent } from './task.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotesComponent } from './notes/notes.component';

const routes: Routes = [
    {
        path: '',
        component: TaskComponent,
            children: [
            {
                path: 'tasks',
                component: TasksComponent,
            },
            {
                path: 'notes',
                component: NotesComponent,
            },
            { path: '', redirectTo: 'tasks', pathMatch: 'full' },
            { path: '**', redirectTo: 'tasks', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class TasksRoutingModule { }