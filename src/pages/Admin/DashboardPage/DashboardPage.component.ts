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

  constructor(
    private adminService: AdminService,
    private manageConfig: ManageConfigService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

}
