import { ApiParams } from 'models/api.model';
import { StatisticService } from 'services/admin/statistic.service';
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

  carditems: {
    id: string,
    icon: string,
    background: string,
    label: string,
    desc: string,
    number: number,
    link?: {
      url: string,
      queryParams: any;
    },
  }[] = [];

  getStatisticPostSubscription: Subscription;

  timeStatisticPost: number = 7;
  timeStatisticPosts: number[] = [-1, 1, 7, 14, 30, 60];

  constructor(
    private adminService: AdminService,
    private manageConfig: ManageConfigService,
    private messageService: MessageService,
    private statisticService: StatisticService,
  ) { }

  ngOnInit() {
    this.getStatisticPost();
  }

  getStatisticPost() {
    if (this.getStatisticPostSubscription) {
      this.getStatisticPostSubscription.unsubscribe();
    }
    const params: ApiParams = {
      time: this.timeStatisticPost,
    }

    this.getStatisticPostSubscription = this.statisticService.getStatisticPostCount(params).subscribe(
      (res) => {
        const statistic = res.data.statistic;
        const desc = this.timeStatisticPost === -1 ? 'All' : this.timeStatisticPost === 1 ? 'Today' : `Last ${this.timeStatisticPost} days ago`;

        this.carditems = [
          {
            id: 'pending',
            icon: 'pi pi-cloud-upload',
            background: 'bg-teal-100',
            label: 'Pending posts',
            desc,
            number: statistic?.pendings,
            link: {
              url: '/admin/manage-post',
              queryParams: {
                status: 'Pending',
                sortBy: 'have_pending_content,created_timestamp',
                orderBy: 'desc,desc'
              }
            }
          },
          {
            id: 'posts',
            icon: 'pi pi-book',
            background: 'bg-blue-100',
            label: 'Posts',
            desc,
            number: statistic.posts,
          },
          {
            id: 'views',
            icon: 'pi pi-eye',
            background: 'bg-green-100',
            label: 'Views',
            desc,
            number: statistic.views,
            link: {
              url: '/admin/manage-post',
              queryParams: {
                sortBy: 'views',
                orderBy: 'desc'
              }
            }
          },
          {
            id: 'likes',
            icon: 'pi pi-thumbs-up',
            background: 'bg-bluegray-100',
            label: 'Likes',
            desc,
            number: statistic.likes,
            link: {
              url: '/admin/manage-post',
              queryParams: {
                sortBy: 'likes',
                orderBy: 'desc'
              }
            }
          },
          {
            id: 'dislikes',
            icon: 'pi pi-thumbs-down',
            background: 'bg-gray-100',
            label: 'Dislikes',
            desc,
            number: statistic.dislikes,
            link: {
              url: '/admin/manage-post',
              queryParams: {
                sortBy: 'dislikes',
                orderBy: 'desc'
              }
            }
          },
          {
            id: 'visited',
            icon: 'pi pi-book',
            background: 'bg-purple-100',
            label: 'Visited',
            desc,
            number: statistic.visited,
          },
          {
            id: 'save',
            icon: 'pi pi-bookmark',
            background: 'bg-indigo-100',
            label: 'Saved',
            desc,
            number: statistic.saved,
          },
          {
            id: 'commentpost',
            icon: 'pi pi-comment',
            background: 'bg-orange-100',
            label: 'Comments',
            desc,
            number: statistic.comments,
            link: {
              url: '/admin/manage-post',
              queryParams: {
                sortBy: 'comments',
                orderBy: 'desc'
              }
            }
          },
        ];
      }
    );
  }

  onChangetimeStatisticPost(event) {
    this.getStatisticPost();
  }

  ngOnDestroy() {
    if (this.getStatisticPostSubscription) {
      this.getStatisticPostSubscription.unsubscribe();
    }
  }

}
