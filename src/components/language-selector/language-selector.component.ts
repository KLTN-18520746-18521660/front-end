import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { UserConfigService } from 'services/user-config.service';

interface LanguageSelector {
  name: string;
  lang: string;
  code: string;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})


export class LanguageSelectorComponent implements OnInit {

  listLanguages: LanguageSelector[];

  selectedLanguage: LanguageSelector;

  constructor(
    private config: PrimeNGConfig,
    private translate: TranslateService,
    private userConfig: UserConfigService
  ) {
    this.translate.get('language').subscribe((res) => {
      this.listLanguages = Object.values(res) as [];
      this.selectedLanguage = this.listLanguages.find(e => e.lang === this.translate.currentLang);
    })
  }

  ngOnInit() {
    
  }

  onChangeLanguage(event) {
    this.userConfig.addConfig('language', event.value);
    this.translate.use(event.value);
    this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
    this.translate.get('language').subscribe((res) => {
      this.listLanguages = Object.values(res) as [];
      this.selectedLanguage = this.listLanguages.find(e => e.lang === this.translate.currentLang);
    });
  }
}
