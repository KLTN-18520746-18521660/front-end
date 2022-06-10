import { ConfigFormat } from 'models/Admins/config.model';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ManageConfigService } from 'services/admin/manage-config.service';

@Component({
  selector: 'app-ManageConfigPage',
  templateUrl: './ManageConfigPage.component.html',
  styleUrls: ['./ManageConfigPage.component.scss']
})
export class ManageConfigPageComponent implements OnInit {

  getAllSubscription: Subscription;

  getByKeySubscription: Subscription;

  reloadSubscription: Subscription;

  isLoading: boolean = false;

  isLoadingDetail: boolean = false;

  displayDialog: boolean = false;

  listConfigKey: any[] = [];

  listConfigValue: any[] = [];

  currentKey: string = '';

  config: any;

  format: {
    [key: string]: ConfigFormat;
  };

  constructor(
    private manageConfigService: ManageConfigService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getAllConfig();
  }

  getAllConfig() {
    this.listConfigKey = [];
    this.listConfigValue = [];
    this.currentKey = '';
    this.isLoading = true;
    this.getAllSubscription = this.manageConfigService.getAllConfig().subscribe(
      (res) => {
        this.listConfigKey = Object.keys(res.data.configs);
        this.listConfigValue = Object.values(res.data.configs);
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  getConfigByKey(key: string) {
    this.config = null;
    this.format = null;
    this.isLoadingDetail = true;
    if (this.getByKeySubscription) {
      this.getByKeySubscription.unsubscribe();
    }
    this.getByKeySubscription = this.manageConfigService.getConfigByKey(key).subscribe(
      (res) => {
        this.config = res.data.config;
        this.format = res.data.format;
        this.isLoadingDetail = false;
      },
      (err) => {
        this.isLoadingDetail = false;
        this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
      }
    )
  }

  onClickEdit(key: string) {
    this.displayDialog = true;
    this.currentKey = key;
    this.getConfigByKey(key);
  }

  reloadConfig() {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
    this.reloadSubscription = this.manageConfigService.reloadConfig().subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: res.message, detail: 'Config reloaded' });
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
      }
    )
  }

  onSuccess() {
    this.displayDialog = false;
    this.getAllConfig();
  }

  ngOnDestroy() {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
    if (this.getAllSubscription) {
      this.getAllSubscription.unsubscribe();
    }
    if (this.getByKeySubscription) {
      this.getByKeySubscription.unsubscribe();
    }
  }

}
