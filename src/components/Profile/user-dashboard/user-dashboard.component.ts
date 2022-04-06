import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  items: MenuItem[];

  carditems: any[] = [
    {
      id: 'posts',
      icon: 'pi-folder',
      background: 'bg-blue-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'followers',
      icon: 'pi pi-user-plus',
      background: 'bg-green-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'views',
      icon: 'pi pi-eye',
      background: 'bg-bluegray-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'likes',
      icon: 'pi pi-thumbs-up',
      background: 'bg-yellow-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'read',
      icon: 'pi pi-book',
      background: 'bg-purple-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'save',
      icon: 'pi pi-bookmark',
      background: 'bg-indigo-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'likeposts',
      icon: 'pi pi-thumbs-up',
      background: 'bg-teal-100',
      label: '',
      desc: '',
      number: '',
    },
    {
      id: 'commentpost',
      icon: 'pi pi-comment',
      background: 'bg-orange-100',
      label: '',
      desc: '',
      number: '',
    },
  ];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];

    this.translate.get('profile.dashboard.card').subscribe((res) => {
      let result = Object.values(res) as any[];
      this.carditems.map((item, index) => {
        item.label = result[index].title;
        item.desc = result[index].desc;
      })
      console.log(this.carditems);
    })
  }

}
