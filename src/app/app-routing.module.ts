import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { CategoryPageComponent } from 'pages/CategoryPage/CategoryPage.component';
import { CreatePostPageComponent } from 'pages/CreatePostPage/CreatePostPage.component';
import { DetailPageComponent } from 'pages/DetailPage/DetailPage.component';
import { HomePageComponent } from 'pages/HomePage/HomePage.component';
import { NoAccessPageComponent } from 'pages/NoAccessPage/NoAccessPage.component';
import { NotFoundPageComponent } from 'pages/NotFoundPage/NotFoundPage.component';
import { PostsPageComponent } from 'pages/PostsPage/PostsPage.component';
import { ProfilePageComponent } from 'pages/ProfilePage/ProfilePage.component';
import { SearchPageComponent } from 'pages/SearchPage/SearchPage.component';
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
      },
      {
        path: 'create',
        component: CreatePostPageComponent,
        data: {
          key: "createPost"
        }
      },
      {
        path: 'post/:slug',
        component: DetailPageComponent,
      },
      {
        path: 'tag/:id',
        component: TagsPageComponent
      },
      {
        path: 'user/:username',
        component: UserInfoPageComponent
      },
      {
        path: 'category/:id',
        component: CategoryPageComponent
      },
      {
        path: 'search',
        component: SearchPageComponent
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./modules/auth.module').then(m => m.AuthModule)
      }
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin.module').then(m => m.AdminModule)
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
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      // scrollOffset: [0, 0],
      onSameUrlNavigation: 'ignore',
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
