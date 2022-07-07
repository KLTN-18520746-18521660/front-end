import { ManageFilePageComponent } from 'pages/Admin/ManageFilePage/ManageFilePage.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminChangePasswordPageComponent } from 'pages/Admin/AdminChangePasswordPage/AdminChangePasswordPage.component';
import { AdminLoginPageComponent } from 'pages/Admin/AdminLoginPage/AdminLoginPage.component';
import { AdminSecurityAcountPageComponent } from 'pages/Admin/AdminSecurityAcountPage/AdminSecurityAcountPage.component';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageAdminPageComponent } from 'pages/Admin/ManageAdminPage/ManageAdminPage.component';
import { ManageCategoryPageComponent } from 'pages/Admin/ManageCategoryPage/ManageCategoryPage.component';
import { ManageConfigPageComponent } from 'pages/Admin/ManageConfigPage/ManageConfigPage.component';
import { ManagePostsPageComponent } from 'pages/Admin/ManagePostsPage/ManagePostsPage.component';
import { ManageRightAdminPageComponent } from 'pages/Admin/ManageRightAdminPage/ManageRightAdminPage.component';
import { ManageRightUserPageComponent } from 'pages/Admin/ManageRightUserPage/ManageRightUserPage.component';
import { ManageRoleAdminPageComponent } from 'pages/Admin/ManageRoleAdminPage/ManageRoleAdminPage.component';
import { ManageRoleUserPageComponent } from 'pages/Admin/ManageRoleUserPage/ManageRoleUserPage.component';
import { ManageTagPageComponent } from 'pages/Admin/ManageTagPage/ManageTagPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { StatisticPostPageComponent } from 'pages/Admin/StatisticPostPage/StatisticPostPage.component';
import { AdminGuard } from 'shared/guards/admin.guard';
import { AdminForgotPasswordPageComponent } from 'pages/Admin/AdminForgotPasswordPage/AdminForgotPasswordPage.component';
import { AdminNoAccessPageComponent } from 'pages/Admin/AdminNoAccessPage/AdminNoAccessPage.component';
import { AdminResetPasswordPageComponent } from 'pages/Admin/AdminResetPasswordPage/AdminResetPasswordPage.component';

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
            path: 'manage-category',
            component: ManageCategoryPageComponent,
            data: { key: 'admin.manage-category' }
          },
          {
            path: 'manage-tag',
            component: ManageTagPageComponent,
            data: { key: 'admin.manage-tag' }
          },
          {
            path: 'statistic-post',
            component: StatisticPostPageComponent,
            data: { key: 'admin.statistic-post' }
          },
          {
            path: 'manage-config',
            component: ManageConfigPageComponent,
            data: { key: 'admin.manage-config' }
          },
          {
            path: 'manage-admin',
            component: ManageAdminPageComponent,
            data: { key: 'admin.manage-admin' }
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
          },
          {
            path: 'security-account',
            component: AdminSecurityAcountPageComponent,
            data: { key: 'admin.security-account' }
          },
          {
            path: 'access-denied',
            component: AdminNoAccessPageComponent,
            data: { key: 'admin.access-denied' }
          },
          {
            path: 'manage-file',
            component: ManageFilePageComponent,
            data: { key: 'admin.manage-file' }
          }
        ]
      },
      {
        path: 'login',
        component: AdminLoginPageComponent,
        data: { key: 'admin.login' }
      },
      {
        path: 'forgot-password',
        component: AdminForgotPasswordPageComponent,
        data: { key: 'admin.forgot-password' }
      },
      {
        path: 'new-password',
        component: AdminResetPasswordPageComponent,
        data: { key: 'admin.new-password' }
      },
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AdminModule { }
