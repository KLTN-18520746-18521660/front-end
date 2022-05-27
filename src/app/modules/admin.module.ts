import { AdminGuard } from './../../shared/guards/admin.guard';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { AdminLoginPageComponent } from 'pages/Admin/AdminLoginPage/AdminLoginPage.component';
import { ManagePostsPageComponent } from 'pages/Admin/ManagePostsPage/ManagePostsPage.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AppMainComponent,
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
        children: [
          {
            path: '',
            component: DashboardPageComponent,
            data: { key: 'admin.dashboard' }
          },
          {
            path: 'manage-user',
            component: ManageUserPageComponent,
            data: { key: 'admin.manage-user' }
          },
          {
            path: 'manage-post',
            component: ManagePostsPageComponent,
            data: { key: 'admin.manage-post' }
          }
        ]
      },
      {
        path: 'login',
        component: AdminLoginPageComponent,
        data: { key: 'admin.login' }
      },
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AdminModule { }
