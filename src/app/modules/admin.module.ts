import { AdminChangePasswordPageComponent } from './../../pages/Admin/AdminChangePasswordPage/AdminChangePasswordPage.component';
import { AdminGuard } from 'shared/guards/admin.guard';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { AdminLoginPageComponent } from 'pages/Admin/AdminLoginPage/AdminLoginPage.component';
import { ManagePostsPageComponent } from 'pages/Admin/ManagePostsPage/ManagePostsPage.component';
import { ManageConfigPageComponent } from 'pages/Admin/ManageConfigPage/ManageConfigPage.component';
import { ManageRightAdminPageComponent } from 'pages/Admin/ManageRightAdminPage/ManageRightAdminPage.component';
import { ManageRoleAdminPageComponent } from 'pages/Admin/ManageRoleAdminPage/ManageRoleAdminPage.component';
import { ManageRightUserPageComponent } from 'pages/Admin/ManageRightUserPage/ManageRightUserPage.component';
import { ManageRoleUserPageComponent } from 'pages/Admin/ManageRoleUserPage/ManageRoleUserPage.component';

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
          },
          {
            path: 'manage-config',
            component: ManageConfigPageComponent,
            data: { key: 'admin.manage-config' }
          },
          {
            path: 'role-user',
            component: ManageRoleUserPageComponent,
            data: { key: 'admin.roleUser' }
          },
          {
            path: 'right-user',
            component: ManageRightUserPageComponent,
            data: { key: 'admin.rightUser' }
          },
          {
            path: 'role-admin',
            component: ManageRoleAdminPageComponent,
            data: { key: 'admin.roleAdmin' }
          },
          {
            path: 'right-admin',
            component: ManageRightAdminPageComponent,
            data: { key: 'admin.rightAdmin' }
          },
          {
            path: 'change-password',
            component: AdminChangePasswordPageComponent,
            data: { key: 'admin.change-password' }
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
