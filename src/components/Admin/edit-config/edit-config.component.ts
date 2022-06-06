import { getDifferenceObject } from 'utils/commonFunction';
import { ManageConfigService } from 'services/admin/manage-config.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfigFormat, ConfigWithFormat } from 'models/Admins/config.model';
import { MessageService } from 'primeng/api';
import _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-edit-config',
  templateUrl: './edit-config.component.html',
  styleUrls: ['./edit-config.component.scss']
})
export class EditConfigComponent implements OnInit {

  @Input() configKey: string;

  @Input() config: any;

  editingConfig: any;

  @Input() formats: {
    [key: string]: ConfigFormat;
  };

  isLoading: boolean = false;

  listConfig: ConfigWithFormat[] = [];

  showButtonSave: boolean = false;

  editConfigSusbcription: Subscription;

  constructor(
    private manageConfigService: ManageConfigService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.editingConfig = { ...this.config };

    for (const key in this.config) {
      if (this.config.hasOwnProperty(key)) {
        this.listConfig.push({
          key,
          value: this.config[key],
          format: this.formats[key]
        });
      }
    }
  }

  onChange(event: ConfigWithFormat) {
    this.editingConfig[event.key] = event.value;
    const data = getDifferenceObject(this.config, this.editingConfig);
    if (_.isEmpty(_.omitBy(data, _.isNull))) {
      this.showButtonSave = false;
    }
    else {
      this.showButtonSave = true;
    }
  }

  onClickSave() {
    this.isLoading = true;
    const data = getDifferenceObject(this.config, this.editingConfig);
    if (_.isEmpty(_.omitBy(data, _.isNull))) {
      return;
    }
    this.editConfigSusbcription = this.manageConfigService.modifyConfig(this.configKey, this.editingConfig).subscribe(
      (res) => {
        this.isLoading = false;
        this.showButtonSave = false;
        this.config = this.editingConfig;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Update config successfully'
        });
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update config failed'
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.editConfigSusbcription) {
      this.editConfigSusbcription.unsubscribe();
    }
  }

}
