import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AsignInternalUserComponent } from './asign-internal-user.component';
import { EditAsignInternalUserComponent } from './edit-asign-internal-user/edit-asign-internal-user.component';
import { ListAsignInternalUserComponent } from './list-asign-internal-user/list-asign-internal-user.component';

const routes: Routes = [
    {
        path: '',
        component: AsignInternalUserComponent,
            children: [
            {
                path: 'list',
                component: ListAsignInternalUserComponent,
            },
            {
                path: 'add',
                component: EditAsignInternalUserComponent,
            },
            {
                path: 'add/:id',
                component: EditAsignInternalUserComponent,
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
export class AsignInternalUsersRoutingModule { }