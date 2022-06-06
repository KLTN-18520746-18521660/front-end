import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, MenuItem } from 'primeng/api';
import { UserConfigService } from 'services/user-config.service';

interface LanguageSelector {
  name: string;
  lang: string;
  flag: string;
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
        flag: "us"
      },
      {
        name: "Tiếng Việt",
        lang: "vi",
        flag: "vn"
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

  onChangeLanguage(event) {
    if (event.value.lang !== this.currentLanguage) {
      this.userConfig.addConfig('language', event.value.lang);
      this.translate.use(event.value.lang);
      window.location.reload();
    }
  }

  onChangeLanguageListBox(event) {
    if (event.value.lang !== this.currentLanguage) {
      this.userConfig.addConfig('language', event.value.lang);
      this.translate.use(event.value.lang);
      window.location.reload();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
