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
      {
        name: "日本",
        lang: "jp",
        flag: "jp"
      }
    ];
    this.selectedLanguage = this.listLanguages.find(e => e.lang === this.translate.currentLang);
    this.selectedLanguageListBox = this.listLanguages.find(e => e.lang === this.translate.currentLang);

    // this.translate.onLangChange.subscribe(() => {
    //   console.log(this.translate.currentLang);
    //   this.selectedLanguage = this.listLanguages.find(e => e.lang === this.translate.currentLang);
    //   this.selectedLanguageListBox = this.translate.currentLang;
    //   this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
    // })
  }

  onChangeLanguage(event) {
    this.userConfig.addConfig('language', event.value.lang);
    this.translate.use(event.value.lang);
  }

  onChangeLanguageListBox(event) {
    this.userConfig.addConfig('language', event.value.lang);
    this.translate.use(event.value.lang);
  }
}
