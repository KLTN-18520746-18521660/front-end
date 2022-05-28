import { EditPostPageComponent } from 'pages/EditPostPage/EditPostPage.component';
import { GoToComponent } from 'components/go-to/go-to.component';
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
import { AuthGuard } from 'shared/guards/auth.guard';
import { CanDeactiveGuard } from 'shared/guards/can-deactive.guard';

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
        path: 'edit/:id',
        component: EditPostPageComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactiveGuard],
        data: {
          key: "editPost"
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
        path: 'goto',
        component: GoToComponent,
        data: {
          key: "goto"
        }
      },
      {
        path: 'no-access',
        component: NoAccessPageComponent,
        data: {
          key: "noAccess"
        }
      },
      {
        path: '404',
        component: NotFoundPageComponent,
        data: {
          key: "notFound"
        }
      },
      {
        path: 'search',
        loadChildren: () => import('./modules/search.module').then(m => m.SearchModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
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
    path: '**',
    component: NotFoundPageComponent,
    data: {
      key: "notFound"
    }
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
