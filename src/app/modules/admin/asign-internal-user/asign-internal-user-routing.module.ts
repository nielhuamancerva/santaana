import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AsignInternalUserComponent } from './asign-internal-user.component';
import { EditAsignInternalUserComponent } from './edit-asign-internal-user/edit-asign-internal-user.component';

const routes: Routes = [
    {
        path: '',
        component: AsignInternalUserComponent,
            children: [
            {
                path: 'list',
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