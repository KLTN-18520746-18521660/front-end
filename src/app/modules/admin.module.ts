import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from 'pages/AuthPage/AuthPage.component';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { ForgotPasswordPageComponent } from 'pages/ForgotPasswordPage/ForgotPasswordPage.component';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: AppMainComponent, children: [
          {
            path: '',
            component: DashboardPageComponent,
            data: { key: 'dashboard' }
          },
          {
            path: 'manage-user',
            component: ManageUserPageComponent,
            data: { key: 'manageUser' }
          },
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AdminModule { }
