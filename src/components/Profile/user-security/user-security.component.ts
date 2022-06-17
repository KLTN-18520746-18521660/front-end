import { Component, OnInit } from '@angular/core';
import { Session } from 'models/api.model';
import { AuthService } from 'services/auth.service';

@Component({
  selector: 'app-user-security',
  templateUrl: './user-security.component.html',
  styleUrls: ['./user-security.component.scss']
})
export class UserSecurityComponent implements OnInit {

  isLoading: boolean = false;

  listSession: Session[];

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getListSession();
  }

  getListSession() {
    this.isLoading = true;
    this.authService.getAllSessionUser().subscribe(
      (res) => {
        this.isLoading = false;
        this.listSession = res.data.sessions;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onDelete(id) {
    this.listSession = this.listSession.filter(item => item.session_token !== id);
  }

}
