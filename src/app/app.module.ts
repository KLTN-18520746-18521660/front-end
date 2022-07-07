import { StringfyObjectComponent } from 'components/stringfy-object/stringfy-object.component';
import { EditorComponent } from 'components/editor/editor.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateEditAdminComponent } from 'components/Admin/create-edit-admin/create-edit-admin.component';
import { CreateEditCategoryComponent } from 'components/Admin/create-edit-category/create-edit-category.component';
import { CreateEditRightComponent } from 'components/Admin/create-edit-right/create-edit-right.component';
import { CreateEditRoleComponent } from 'components/Admin/create-edit-role/create-edit-role.component';
import { CreateEditTagComponent } from 'components/Admin/create-edit-tag/create-edit-tag.component';
import { CreateEditUserComponent } from 'components/Admin/create-edit-user/create-edit-user.component';
import { EditConfigComponent } from 'components/Admin/edit-config/edit-config.component';
import { RightFormComponent } from 'components/Admin/right-form/right-form.component';
import { BtnGiveFeedbackComponent } from 'components/Buttons/btn-give-feedback/btn-give-feedback.component';
import { NotificationCardComponent } from 'components/Cards/notification-card/notification-card.component';
import { PostCardComponent } from 'components/Cards/post-card/post-card.component';
import { RecommendPostCardComponent } from 'components/Cards/recommend-post-card/recommend-post-card.component';
import { SessionCardComponent } from 'components/Cards/session-card/session-card.component';
import { UserCardComponent } from 'components/Cards/user-card/user-card.component';
import { SwitchThemeComponent } from 'components/Configs/switch-theme/switch-theme.component';
import { DockComponent } from 'components/dock/dock.component';
import { EmptyComponent } from 'components/Errors/empty/empty.component';
import { NoAccessComponent } from 'components/Errors/no-access/no-access.component';
import { ServerErrorComponent } from 'components/Errors/server-error/server-error.component';
import { CommentInputComponent } from 'components/Input/comment-input/comment-input.component';
import { CategoryComponent } from 'components/Links/category/category.component';
import { LinkTextComponent } from 'components/Links/link-text/link-text.component';
import { ViewImageComponent } from 'components/Popups/view-image/view-image.component';
import { ComparePostComponent } from 'components/Posts/compare-post/compare-post.component';
import { DiffTextComponent } from 'components/Posts/diff-text/diff-text.component';
import { RenderContentComponent } from 'components/Posts/render-content/render-content.component';
import { ViewDetailPostComponent } from 'components/Posts/view-detail-post/view-detail-post.component';
import { UserFollowerComponent } from 'components/Profile/user-follower/user-follower.component';
import { UserFollowingComponent } from 'components/Profile/user-following/user-following.component';
import { UserPostSavedComponent } from 'components/Profile/user-post-saved/user-post-saved.component';
import { UserSecurityComponent } from 'components/Profile/user-security/user-security.component';
import { ReadMoreComponent } from 'components/read-more/read-more.component';
import { SearchAllComponent } from 'components/Searchs/search-all/search-all.component';
import { SearchPostComponent } from 'components/Searchs/search-post/search-post.component';
import { SimpleGridViewComponent } from 'components/simple-grid-view/simple-grid-view.component';
import { StatusBadgeComponent } from 'components/status-badge/status-badge.component';
import { PostTimlineComponent } from 'components/Timlines/post-timline/post-timline.component';
import { AdminChangePasswordPageComponent } from 'pages/Admin/AdminChangePasswordPage/AdminChangePasswordPage.component';
import { AdminSecurityAcountPageComponent } from 'pages/Admin/AdminSecurityAcountPage/AdminSecurityAcountPage.component';
import { ManageAdminPageComponent } from 'pages/Admin/ManageAdminPage/ManageAdminPage.component';
import { ManageCategoryPageComponent } from 'pages/Admin/ManageCategoryPage/ManageCategoryPage.component';
import { ManageConfigPageComponent } from 'pages/Admin/ManageConfigPage/ManageConfigPage.component';
import { ManageRightAdminPageComponent } from 'pages/Admin/ManageRightAdminPage/ManageRightAdminPage.component';
import { ManageRightUserPageComponent } from 'pages/Admin/ManageRightUserPage/ManageRightUserPage.component';
import { ManageRoleAdminPageComponent } from 'pages/Admin/ManageRoleAdminPage/ManageRoleAdminPage.component';
import { ManageRoleUserPageComponent } from 'pages/Admin/ManageRoleUserPage/ManageRoleUserPage.component';
import { ManageTagPageComponent } from 'pages/Admin/ManageTagPage/ManageTagPage.component';
import { StatisticPostPageComponent } from 'pages/Admin/StatisticPostPage/StatisticPostPage.component';
import { EditPostPageComponent } from 'pages/EditPostPage/EditPostPage.component';
import { ServerErrorPageComponent } from 'pages/ServerErrorPage/ServerErrorPage.component';
import { UserInfoPageComponent } from 'pages/UserInfoPage/UserInfoPage.component';
import { APPCONSTANT } from 'utils/appConstant';
import { AdminForgotPasswordPageComponent } from 'pages/Admin/AdminForgotPasswordPage/AdminForgotPasswordPage.component';
import { AdminNoAccessPageComponent } from 'pages/Admin/AdminNoAccessPage/AdminNoAccessPage.component';
import { AdminResetPasswordPageComponent } from 'pages/Admin/AdminResetPasswordPage/AdminResetPasswordPage.component';
import { ManageFilePageComponent } from 'pages/Admin/ManageFilePage/ManageFilePage.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import packages
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { CookieService } from 'services/cookie.service';
import { NgprimeModule } from './modules/ngprime.module';


// Import pages
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { DashboardPageComponent } from 'pages/Admin/DashboardPage/DashboardPage.component';
import { ManageUserPageComponent } from 'pages/Admin/ManageUserPage/ManageUserPage.component';
import { DetailPageComponent } from 'pages/DetailPage/DetailPage.component';
import { HomePageComponent } from 'pages/HomePage/HomePage.component';
import { NoAccessPageComponent } from 'pages/NoAccessPage/NoAccessPage.component';
import { NotFoundPageComponent } from 'pages/NotFoundPage/NotFoundPage.component';

// Import components
import { FooterComponent } from 'components/footer/footer.component';
import { SearchInputComponent } from 'components/Input/search-input/search-input.component';
import { TagComponent } from 'components/Links/tag/tag.component';
import { TopBarComponent } from 'components/top-bar/top-bar.component';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';

import { SocialLoginModule } from 'angularx-social-login';
import { MenuComponent } from 'components/Admin/menu/menu.component';
import { AppMenuitemComponent } from 'components/Admin/menu/menuitem.component';
import { TopbarAdminComponent } from 'components/Admin/topbar-admin/topbar-admin.component';
import { BtnFabComponent } from 'components/Buttons/btn-fab/btn-fab.component';
import { BtnMenuComponent } from 'components/Buttons/btn-menu/btn-menu.component';
import { BtnScrollToTopComponent } from 'components/Buttons/btn-scroll-to-top/btn-scroll-to-top.component';
import { ButtonComponent } from 'components/Buttons/button/button.component';
import { CommentCardComponent } from 'components/Cards/comment-card/comment-card.component';
import { PostCardVerticalComponent } from 'components/Cards/post-card-vertical/post-card-vertical.component';
import { UserInfoCardComponent } from 'components/Cards/user-info-card/user-info-card.component';
import { MyAppConfigComponent } from 'components/Configs/app-config/app-config.component';
import { LanguageSelectorComponent } from 'components/Configs/language-selector/language-selector.component';
import { LoadingSpinnerComponent } from 'components/Loadings/loading-spinner/loading-spinner.component';
import { LoadingComponent } from 'components/Loadings/loading/loading.component';
import { ChangePasswordComponent } from 'components/Profile/change-password/change-password.component';
import { UserDashboardComponent } from 'components/Profile/user-dashboard/user-dashboard.component';
import { UserInfoComponent } from 'components/Profile/user-info/user-info.component';
import { UserManagePostComponent } from 'components/Profile/user-manage-post/user-manage-post.component';
import { UserNotificationComponent } from 'components/Profile/user-notification/user-notification.component';
import { UserSettingComponent } from 'components/Profile/user-setting/user-setting.component';
import { AdminLoginPageComponent } from 'pages/Admin/AdminLoginPage/AdminLoginPage.component';
import { AuthPageComponent } from 'pages/AuthPage/AuthPage.component';
import { CategoryPageComponent } from 'pages/CategoryPage/CategoryPage.component';
import { ConfirmAccountPageComponent } from 'pages/ConfirmAccountPage/ConfirmAccountPage.component';
import { CreatePostPageComponent } from 'pages/CreatePostPage/CreatePostPage.component';
import { ForgotPasswordPageComponent } from 'pages/ForgotPasswordPage/ForgotPasswordPage.component';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { PostsPageComponent } from 'pages/PostsPage/PostsPage.component';
import { ProfilePageComponent } from 'pages/ProfilePage/ProfilePage.component';
import { SearchPageComponent } from 'pages/SearchPage/SearchPage.component';
import { SignUpPageComponent } from 'pages/SignUpPage/SignUpPage.component';
import { TagsPageComponent } from 'pages/TagsPage/TagsPage.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountUpDirective } from 'shared/directives/countUp.directive';
import { ImageOnErrorDirective } from 'shared/directives/imageOnError.directive';
import { ReadMoreDirective } from 'shared/directives/readMore.directive';
import { authInterceptorProviders } from 'shared/helpers/auth.interceptor';
import { MyMissingTranslationHandler } from 'shared/mising-translation';
import { ShortNumberPipe } from 'shared/pipes/shortnumber.pipe';
import { AdminModule } from './modules/admin.module';
import { AuthModule } from './modules/auth.module';
import { ProfileModule } from './modules/profile.module';

// import 'prismjs/prism.js';
// import 'prismjs/components/prism-typescript.min.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
// import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

import { UserIdleModule } from 'angular-user-idle';
import { DynamicFormComponent } from 'components/Admin/dynamic-form/dynamic-form.component';
import { AvatarComponent } from 'components/avatar/avatar.component';
import { CheckIconComponent } from 'components/check-icon/check-icon.component';
import { NotFoundComponent } from 'components/Errors/not-found/not-found.component';
import { GoToComponent } from 'components/go-to/go-to.component';
import { RedirectingComponent } from 'components/Loadings/redirecting/redirecting.component';
import { ReportPopupComponent } from 'components/Popups/report-popup/report-popup.component';
import { UploadImageComponent } from 'components/Popups/upload-image/upload-image.component';
import { UserEditInfoComponent } from 'components/Profile/user-edit-info/user-edit-info.component';
import { UserSidebarMenuComponent } from 'components/Profile/user-sidebar-menu/user-sidebar-menu.component';
import { SearchUserComponent } from 'components/Searchs/search-user/search-user.component';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { ManagePostsPageComponent } from 'pages/Admin/ManagePostsPage/ManagePostsPage.component';
import { NewPasswordPageComponent } from 'pages/NewPasswordPage/NewPasswordPage.component';
import { AutoFocusDirective } from 'shared/directives/autofocus.directive';
import { OpenNewWindowDirective } from 'shared/directives/openNewWindow.directive';
import { RequiredFieldDirective } from 'shared/directives/requiredField.directive';
import { CanDeactiveGuard } from 'shared/guards/can-deactive.guard';
import { CapitalizePipe } from 'shared/pipes/capitalize.pipe';
import { NAPipe } from 'shared/pipes/n-a.pipe';
import { SafePipe } from 'shared/pipes/safe.pipe';
import { SearchModule } from './modules/search.module';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
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
    CapitalizePipe,
    AutoFocusDirective,
    UserEditInfoComponent,
    RequiredFieldDirective,
    AvatarComponent,
    ReportPopupComponent,
    CheckIconComponent,
    NotFoundComponent,
    UserCardComponent,
    UserFollowerComponent,
    UserFollowingComponent,
    NotificationCardComponent,
    StatusBadgeComponent,
    CategoryComponent,
    RedirectingComponent,
    GoToComponent,
    NewPasswordPageComponent,
    UserSidebarMenuComponent,
    EditPostPageComponent,
    DockComponent,
    OpenNewWindowDirective,
    SimpleGridViewComponent,
    UserSecurityComponent,
    SessionCardComponent,
    BtnGiveFeedbackComponent,
    EmptyComponent,
    LinkTextComponent,
    SearchAllComponent,
    SearchPostComponent,
    SearchUserComponent,
    UserPostSavedComponent,
    ServerErrorComponent,
    ServerErrorPageComponent,
    ViewDetailPostComponent,
    NoAccessComponent,
    PostTimlineComponent,
    ViewImageComponent,
    RenderContentComponent,
    ComparePostComponent,
    DiffTextComponent,
    UploadImageComponent,
    EditorComponent,
    SwitchThemeComponent,
    StringfyObjectComponent,

    ManagePostsPageComponent,
    TopbarAdminComponent,
    MenuComponent,
    AppMenuitemComponent,
    AdminLoginPageComponent,
    ManageConfigPageComponent,
    EditConfigComponent,
    ManageRoleAdminPageComponent,
    ManageRightAdminPageComponent,
    ManageRoleUserPageComponent,
    ManageRightUserPageComponent,
    DynamicFormComponent,
    AdminChangePasswordPageComponent,
    CreateEditRightComponent,
    CreateEditRoleComponent,
    RightFormComponent,
    ManageAdminPageComponent,
    AdminSecurityAcountPageComponent,
    CreateEditAdminComponent,
    StatisticPostPageComponent,
    ManageCategoryPageComponent,
    ManageTagPageComponent,
    CreateEditCategoryComponent,
    CreateEditTagComponent,
    CreateEditUserComponent,
    AdminForgotPasswordPageComponent,
    AdminResetPasswordPageComponent,
    AdminNoAccessPageComponent,
    ManageFilePageComponent,
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
    SearchModule,
    ClipboardModule,
    UserIdleModule.forRoot({
      idle: APPCONSTANT.USER_IDLE.IDLE,
      timeout: APPCONSTANT.USER_IDLE.TIMEOUT,
      ping: APPCONSTANT.USER_IDLE.PING
    }),
    InfiniteScrollModule,
    NgxLinkifyjsModule.forRoot(),
    SocialLoginModule,
    LottieModule.forRoot({ player: playerFactory }),
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
    ReportPopupComponent,
    SearchInputComponent
  ],
  providers: [
    authInterceptorProviders,
    MessageService,
    CookieService,
    CanDeactiveGuard,
    AppUserComponent,
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