import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from 'pages/AuthPage/AuthPage.component';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { ForgotPasswordPageComponent } from 'pages/ForgotPasswordPage/ForgotPasswordPage.component';
import { ConfirmAccountPageComponent } from 'pages/ConfirmAccountPage/ConfirmAccountPage.component';
import { SecureInnerPagesGuard } from 'shared/guards/secure-inner-pages.guard';
import { NewPasswordPageComponent } from 'pages/NewPasswordPage/NewPasswordPage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: AuthPageComponent, children: [
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
          },
          {
            path: 'login',
            component: LoginPageComponent,
            data: { key: 'login' },
            canActivate: [SecureInnerPagesGuard],
          },
          {
            path: 'register',
            component: SignUpPageComponent,
            data: { key: 'register' },
          },
          {
            path: 'confirm-account',
            component: ConfirmAccountPageComponent,
            data: { key: 'confirm-account' }
          },
          {
            path: 'forgot-password',
            component: ForgotPasswordPageComponent,
            data: { key: 'forgotpassword' }
          },
          {
            path: 'reset-password',
            component: NewPasswordPageComponent,
            data: { key: 'newpassword' }
          },
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AuthModule { }
