import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, MenuItem } from 'primeng/api';
import { UserConfigService } from 'services/user-config.service';

interface LanguageSelector {
  name: string;
  lang: string;
  flag: string;
  short_name: string;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})

export class LanguageSelectorComponent implements OnInit {

  @Input() type: 'dropdown' | 'listbox' = 'dropdown';

  selectedLanguageListBox: LanguageSelector;

  listLanguages: LanguageSelector[];

  selectedLanguage: LanguageSelector;

  currentLanguage: string;

  subscription: Subscription;

  constructor(
    private config: PrimeNGConfig,
    private translate: TranslateService,
    private userConfig: UserConfigService
  ) {
  }

  ngOnInit() {
    this.listLanguages = [
      {
        name: "English",
        lang: "en",
        flag: "us",
        short_name: "ENG"
      },
      {
        name: "Tiếng Việt",
        lang: "vi",
        flag: "vn",
        short_name: "VIE"
      },
      // {
      //   name: "日本",
      //   lang: "jp",
      //   flag: "jp"
      // }
    ];

    this.currentLanguage = this.translate.currentLang;
    this.selectedLanguage = this.listLanguages.find(e => e.lang === this.translate.currentLang);
    this.selectedLanguageListBox = this.listLanguages.find(e => e.lang === this.translate.currentLang);

    this.subscription = this.translate.onLangChange.subscribe(() => {
      this.currentLanguage = this.translate.currentLang;
      this.config.setTranslation(this.translate.instant('primeng'));
    })
  }

  // for dropdown
  onChangeLanguage(event) {
    console.log(event);
    if (event.value !== this.currentLanguage) {
      this.userConfig.addConfig('language', event.value);
      this.translate.use(event.value);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  onChangeLanguageListBox(event) {
    console.log(event);
    if (event.value.lang !== this.currentLanguage) {
      this.userConfig.addConfig('language', event.value.lang);
      this.translate.use(event.value.lang);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
