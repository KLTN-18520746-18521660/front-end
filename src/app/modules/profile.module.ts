import { UserSecurityComponent } from 'components/Profile/user-security/user-security.component';
import { UserFollowerComponent } from 'components/Profile/user-follower/user-follower.component';
import { UserFollowingComponent } from 'components/Profile/user-following/user-following.component';
import { UserPostSavedComponent } from 'components/Profile/user-post-saved/user-post-saved.component';
import { UserInfoComponent } from 'components/Profile/user-info/user-info.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from 'components/Profile/change-password/change-password.component';
import { ProfilePageComponent } from 'pages/ProfilePage/ProfilePage.component';
import { RouterModule } from '@angular/router';
import { UserSettingComponent } from 'components/Profile/user-setting/user-setting.component';
import { UserDashboardComponent } from 'components/Profile/user-dashboard/user-dashboard.component';
import { UserNotificationComponent } from 'components/Profile/user-notification/user-notification.component';
import { UserManagePostComponent } from 'components/Profile/user-manage-post/user-manage-post.component';
import { UserEditInfoComponent } from 'components/Profile/user-edit-info/user-edit-info.component';
import { CanDeactiveGuard } from 'shared/guards/can-deactive.guard';
import { AuthGuard } from 'shared/guards/auth.guard';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent,
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            component: UserDashboardComponent,
            data: {
              key: "dashboard"
            }
          },
          {
            path: 'user-info',
            component: UserInfoComponent,
            data: {
              key: 'user-info'
            }
          },
          {
            path: 'edit-info',
            component: UserEditInfoComponent,
            canDeactivate: [CanDeactiveGuard],
            data: {
              key: 'edit-info'
            }
          },
          {
            path: 'security',
            component: UserSecurityComponent,
            data: {
              key: 'security'
            }
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
            data: {
              key: 'change-password'
            }
          },

          {
            path: 'manage-post',
            component: UserManagePostComponent,
            data: {
              key: 'manage-post'
            }
          },
          {
            path: 'history-activity',
            component: UserPostSavedComponent,
            data: {
              key: 'history-activity'
            }
          },
          {
            path: 'following',
            component: UserFollowingComponent,
            data: {
              key: 'following'
            }
          },
          {
            path: 'followers',
            component: UserFollowerComponent,
            data: {
              key: 'followers'
            }
          },
          {
            path: 'notifications',
            component: UserNotificationComponent,
            data: {
              key: 'notifications'
            }
          },
          {
            path: 'settings',
            component: UserSettingComponent,
            data: {
              key: 'settings'
            }
          },
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class ProfileModule { }
