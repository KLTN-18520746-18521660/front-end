import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { DetailPageComponent } from 'pages/DetailPage/DetailPage.component';
import { HomePageComponent } from 'pages/HomePage/HomePage.component';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { NoAccessPageComponent } from 'pages/NoAccessPage/NoAccessPage.component';
import { NotFoundPageComponent } from 'pages/NotFoundPage/NotFoundPage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { TagsPageComponent } from 'pages/TagsPage/TagsPage.component';

const routes: Routes = [
  {
    path: '', component: AppUserComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'post/:id', component: DetailPageComponent },
      { path: 'tags/:id', component: TagsPageComponent },
    ],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: SignUpPageComponent },
  {
    path: 'admin', component: AppMainComponent,
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'manage-user', component: ManageUserPageComponent },
    ]
  },
  { path: 'no-access', component: NoAccessPageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
