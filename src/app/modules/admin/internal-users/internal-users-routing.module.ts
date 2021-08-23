import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { InternalUsersComponent } from './internal-users.component';
import { EditInternalUserComponent } from './internal-user/internal-user.component';
import { ListInternalUserComponent } from './list-internal-user/list-internal-user.component';

const routes: Routes = [
    {
        path: '',
        component: InternalUsersComponent,
            children: [
            {
                path: 'add',
                component: EditInternalUserComponent,
            },
            {
                path: 'list',
                component: ListInternalUserComponent,
            },
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: '**', redirectTo: 'list', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class InternalUsersRoutingModule { }