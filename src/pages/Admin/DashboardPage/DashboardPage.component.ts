import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'services/admin.service';

@Component({
  selector: 'app-DashboardPage',
  templateUrl: './DashboardPage.component.html',
  styleUrls: ['./DashboardPage.component.scss']
})
export class DashboardPageComponent implements OnInit {

  reloadSubscription: Subscription;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  reloadConfig() {
    if (this.reloadSubscription) {
      return;
    }
    this.reloadSubscription = this.adminService.reloadConfig(this.adminService.getSessionId()).subscribe(
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
