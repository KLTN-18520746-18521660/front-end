import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Import packages
import { NgprimeModule } from './modules/ngprime.module';
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

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
import { AppConfigComponent } from 'pages/Admin/app.config.component';
import { TagsPageComponent } from 'pages/TagsPage/TagsPage.component';
import { MyMissingTranslationHandler } from 'shared/mising-translation';
import { MyAppConfigComponent } from 'components/app-config/app-config.component';

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

    TopbarAdminComponent,
    MenuComponent,
    AppMenuitemComponent,
    AppConfigComponent,
    AdminLoginPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    NgprimeModule,
    NgScrollbarModule,
    TranslateModule.forRoot({
      defaultLanguage: 'vn',
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
  providers: [
    authInterceptorProviders,
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: {
        scrollAuditTime: 20,
        scrollEasing: 'ease-out',
        autoHeightDisabled: false,
        visibility: 'hover',
        track: 'all',

      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
