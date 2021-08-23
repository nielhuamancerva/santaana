import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      {
        path: 'ecommerce',
        loadChildren: () =>
          import('../modules/e-commerce/e-commerce.module').then(
            (m) => m.ECommerceModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'internal-users',
        loadChildren: () =>
        import('../modules/admin/internal-users/internal-users.module').then(
            (m) => m.InternalUsersModule
            ),
      },
      {
          path: 'user-management',
          loadChildren: () =>
          import('../modules/admin/user-management/user-management.module').then(
              (m) => m.UserManagementModule
              ),
      },
      {
          path: 'payment-management',
          loadChildren: () =>
          import('../modules/admin/payment-management/payment-management.module').then(
              (m) => m.PaymentManagementModule
              ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
