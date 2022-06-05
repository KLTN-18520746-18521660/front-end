import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'services/admin.service';
import { ManageConfigService } from 'services/admin/manage-config.service';

@Component({
  selector: 'app-DashboardPage',
  templateUrl: './DashboardPage.component.html',
  styleUrls: ['./DashboardPage.component.scss']
})
export class DashboardPageComponent implements OnInit {

  reloadSubscription: Subscription;

  constructor(
    private adminService: AdminService,
    private manageConfig: ManageConfigService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  reloadConfig() {
    if (this.reloadSubscription) {
      return;
    }
    this.reloadSubscription = this.manageConfig.reloadConfig().subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: res.message, detail: 'Config reloaded' });
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
      }
    )
  }

  ngOnDestroy() {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

}
