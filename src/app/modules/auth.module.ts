import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from 'pages/AuthPage/AuthPage.component';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { ForgotPasswordPageComponent } from 'pages/ForgotPasswordPage/ForgotPasswordPage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: AuthPageComponent, children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: LoginPageComponent },
          { path: 'register', component: SignUpPageComponent },
          { path: 'forgotpassword', component: ForgotPasswordPageComponent }
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AuthModule { }
