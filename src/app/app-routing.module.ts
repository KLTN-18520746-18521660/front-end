import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { CreatePostPageComponent } from 'pages/CreatePostPage/CreatePostPage.component';
import { DetailPageComponent } from 'pages/DetailPage/DetailPage.component';
import { HomePageComponent } from 'pages/HomePage/HomePage.component';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { NoAccessPageComponent } from 'pages/NoAccessPage/NoAccessPage.component';
import { NotFoundPageComponent } from 'pages/NotFoundPage/NotFoundPage.component';
import { PostsPageComponent } from 'pages/PostsPage/PostsPage.component';
import { ProfilePageComponent } from 'pages/ProfilePage/ProfilePage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { TagsPageComponent } from 'pages/TagsPage/TagsPage.component';
import { UserInfoPageComponent } from 'pages/UserInfoPage/UserInfoPage.component';

const routes: Routes = [
  {
    path: '', component: AppUserComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        data: {
          key: "home"
        }
      },
      {
        path: 'post',
        component: PostsPageComponent,
        data: {
          key: "post"
        }
      },
      {
        path: 'post/create',
        component: CreatePostPageComponent,
        data: {
          key: ""
        }
      },
      {
        path: 'post/:id',
        component: DetailPageComponent
      },
      {
        path: 'tags/:id',
        component: TagsPageComponent
      },
      {
        path: 'user/:id',
        component: UserInfoPageComponent
      },
      {
        path: 'profile',
        component: ProfilePageComponent
      },
    ],
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'admin',
    component: AppMainComponent,
    children: [
      {
        path: '',
        component: DashboardPageComponent
      },
      {
        path: 'manage-user',
        component: ManageUserPageComponent
      },
    ]
  },
  {
    path: 'no-access',
    component: NoAccessPageComponent
  },
  {
    path: '404',
    component: NotFoundPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
      onSameUrlNavigation: 'ignore',
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
