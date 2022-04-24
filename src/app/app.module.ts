import { StatusBadgeComponent } from './../components/status-badge/status-badge.component';
import { NotificationCardComponent } from './../components/Cards/notification-card/notification-card.component';
import { UserFollowingComponent } from './../components/Profile/user-following/user-following.component';
import { UserFollowerComponent } from './../components/Profile/user-follower/user-follower.component';
import { UserCardComponent } from './../components/Cards/user-card/user-card.component';
import { CommentInputComponent } from './../components/Input/comment-input/comment-input.component';
import { RecommendPostCardComponent } from './../components/Cards/recommend-post-card/recommend-post-card.component';
import { UserInfoPageComponent } from './../pages/UserInfoPage/UserInfoPage.component';
import { PostCardComponent } from './../components/Cards/post-card/post-card.component';
import { ReadMoreComponent } from './../components/read-more/read-more.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { APPCONSTANT } from 'utils/appConstant';

// Import packages
import { NgprimeModule } from './modules/ngprime.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { CookieService } from 'services/cookie.service';


// Import pages
import { HomePageComponent } from 'pages/HomePage/HomePage.component';
import { DetailPageComponent } from 'pages/DetailPage/DetailPage.component';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { NoAccessPageComponent } from 'pages/NoAccessPage/NoAccessPage.component';
import { NotFoundPageComponent } from 'pages/NotFoundPage/NotFoundPage.component';

// Import components
import { TopBarComponent } from 'components/top-bar/top-bar.component';
import { FooterComponent } from 'components/footer/footer.component';
import { TagComponent } from './../components/tag/tag.component';
import { SearchInputComponent } from './../components/search-input/search-input.component';
import { AppUserComponent } from './../pages/AppUser/AppUser.component';

import { authInterceptorProviders } from '../shared/helpers/auth.interceptor';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { TopbarAdminComponent } from 'components/Admin/topbar-admin/topbar-admin.component';
import { MenuComponent } from 'components/Admin/menu/menu.component';
import { AppMenuitemComponent } from 'components/Admin/menu/menuitem.component';
import { AdminLoginPageComponent } from 'pages/Admin/AdminLoginPage/AdminLoginPage.component';
import { TagsPageComponent } from 'pages/TagsPage/TagsPage.component';
import { MyMissingTranslationHandler } from 'shared/mising-translation';
import { MyAppConfigComponent } from 'components/app-config/app-config.component';
import { BtnFabComponent } from 'components/Buttons/btn-fab/btn-fab.component';
import { BtnMenuComponent } from 'components/Buttons/btn-menu/btn-menu.component';
import { PostsPageComponent } from 'pages/PostsPage/PostsPage.component';
import { ShortNumberPipe } from 'shared/pipes/shortnumber.pipe';
import { CreatePostPageComponent } from 'pages/CreatePostPage/CreatePostPage.component';
import { ProfilePageComponent } from 'pages/ProfilePage/ProfilePage.component';
import { ImageOnErrorDirective } from 'shared/directives/imageOnError.directive';
import { BtnScrollToTopComponent } from 'components/Buttons/btn-scroll-to-top/btn-scroll-to-top.component';
import { LanguageSelectorComponent } from 'components/language-selector/language-selector.component';
import { AuthModule } from './modules/auth.module';
import { AuthPageComponent } from 'pages/AuthPage/AuthPage.component';
import { ForgotPasswordPageComponent } from 'pages/ForgotPasswordPage/ForgotPasswordPage.component';
import { UserInfoCardComponent } from 'components/Cards/user-info-card/user-info-card.component';
import { ButtonComponent } from 'components/Buttons/button/button.component';
import { CountUpDirective } from 'shared/directives/countUp.directive';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { LoadingComponent } from 'components/loading/loading.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommentCardComponent } from 'components/Cards/comment-card/comment-card.component';
import { ReadMoreDirective } from 'shared/directives/readMore.directive';
import { LoadingSpinnerComponent } from 'components/loading-spinner/loading-spinner.component';
import { CategoryPageComponent } from 'pages/CategoryPage/CategoryPage.component';
import { PostCardVerticalComponent } from 'components/Cards/post-card-vertical/post-card-vertical.component';
import { SearchPageComponent } from 'pages/SearchPage/SearchPage.component';
import { AdminModule } from './modules/admin.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmAccountPageComponent } from 'pages/ConfirmAccountPage/ConfirmAccountPage.component';
import { ProfileModule } from './modules/profile.module';
import { UserDashboardComponent } from 'components/Profile/user-dashboard/user-dashboard.component';
import { ChangePasswordComponent } from 'components/Profile/change-password/change-password.component';
import { UserInfoComponent } from 'components/Profile/user-info/user-info.component';
import { UserSettingComponent } from 'components/Profile/user-setting/user-setting.component';
import { UserNotificationComponent } from 'components/Profile/user-notification/user-notification.component';
import { UserManagePostComponent } from 'components/Profile/user-manage-post/user-manage-post.component';

// import 'prismjs/prism.js';
// import 'prismjs/components/prism-typescript.min.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
// import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

import { SafePipe } from 'shared/pipes/safe.pipe';
import { UserEditInfoComponent } from 'components/Profile/user-edit-info/user-edit-info.component';
import { RequiredFieldDirective } from 'shared/directives/requiredField.directive';
import { AvatarComponent } from 'components/avatar/avatar.component';
import { ManagePostsPageComponent } from 'pages/Admin/ManagePostsPage/ManagePostsPage.component';
import { ReportPopupComponent } from 'components/Popups/report-popup/report-popup.component';
import { UserIdleModule } from 'angular-user-idle';
import { CheckIconComponent } from 'components/check-icon/check-icon.component';
import { NotFoundComponent } from 'components/not-found/not-found.component';
import { AutoFocusDirective } from 'shared/directives/autofocus.directive';
import { NAPipe } from 'shared/pipes/n-a.pipe';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    FooterComponent,
    HomePageComponent,
    LoginPageComponent,
    SignUpPageComponent,
    DetailPageComponent,
    AppMainComponent,
    AppUserComponent,
    SearchInputComponent,
    DashboardPageComponent,
    ManageUserPageComponent,
    NotFoundPageComponent,
    NoAccessPageComponent,
    TagComponent,
    TagsPageComponent,
    MyAppConfigComponent,
    BtnFabComponent,
    ReadMoreComponent,
    PostCardComponent,
    UserInfoPageComponent,
    BtnMenuComponent,
    PostsPageComponent,
    ShortNumberPipe,
    RecommendPostCardComponent,
    CreatePostPageComponent,
    ProfilePageComponent,
    ImageOnErrorDirective,
    BtnScrollToTopComponent,
    LanguageSelectorComponent,
    AuthPageComponent,
    ForgotPasswordPageComponent,
    UserInfoCardComponent,
    ButtonComponent,
    CountUpDirective,
    LoadingComponent,
    CommentInputComponent,
    CommentCardComponent,
    ReadMoreDirective,
    LoadingSpinnerComponent,
    CategoryPageComponent,
    PostCardVerticalComponent,
    SearchPageComponent,
    ConfirmAccountPageComponent,
    ChangePasswordComponent,
    UserDashboardComponent,
    UserInfoComponent,
    UserSettingComponent,
    UserNotificationComponent,
    UserManagePostComponent,
    SafePipe,
    NAPipe,
    AutoFocusDirective,
    UserEditInfoComponent,
    RequiredFieldDirective,
    AvatarComponent,
    ManagePostsPageComponent,
    ReportPopupComponent,
    CheckIconComponent,
    NotFoundComponent,
    UserCardComponent,
    UserFollowerComponent,
    UserFollowingComponent,
    NotificationCardComponent,
    StatusBadgeComponent,

    TopbarAdminComponent,
    MenuComponent,
    AppMenuitemComponent,
    AdminLoginPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgprimeModule,
    AuthModule,
    AdminModule,
    ProfileModule,
    ClipboardModule,
    UserIdleModule.forRoot({
      idle: APPCONSTANT.USER_IDLE.IDLE,
      timeout: APPCONSTANT.USER_IDLE.TIMEOUT,
      ping: APPCONSTANT.USER_IDLE.PING
    }),
    InfiniteScrollModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      }
    }),
    NgxLinkifyjsModule.forRoot(),
    SocialLoginModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      }
    }),
  ],
  entryComponents: [
    LoginPageComponent,
    ReportPopupComponent
  ],
  providers: [
    authInterceptorProviders,
    MessageService,
    CookieService,
    ConfirmationService,
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '371642256601-n9lv5qu9j8qh9msq9388li0sp2gk1th2.apps.googleusercontent.com'
    //         ),
    //       },
    //     ]
    //   } as SocialAuthServiceConfig
    // }
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.code = function (code, language) {
    if (language.match(/^mermaid/)) {
      return '<div class="mermaid">' + code + '</div>';
    } else {
      return '<pre><code>' + code + '</code></pre>';
    }
  };
  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false
  };
}