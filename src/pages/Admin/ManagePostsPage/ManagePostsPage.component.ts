import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { ApiParams } from 'models/api.model';
import Post from 'models/post.model';
import { QueryParams, TableData } from 'models/table.model';
import User from 'models/user.model';
import { ConfirmationService, MessageService, SortMeta } from 'primeng/api';
import { Subscription } from 'rxjs';
import { convertDateTime, convertToMultiSortMeta } from 'utils/commonFunction';
import { ManagePostService } from 'services/admin/manage-post.service';
import { ManageAdminUserService } from 'services/admin/manage-admin-user.service';

@Component({
  selector: 'app-ManagePostsPage',
  templateUrl: './ManagePostsPage.component.html',
  styleUrls: ['./ManagePostsPage.component.scss']
})
export class ManagePostsPageComponent implements OnInit {

  isLoading: boolean = true;

  isLoadingTable: boolean = false;

  isLoadingDialog: boolean = false;

  error: boolean = false;

  listPosts: Post[];

  selectedPosts: Post[] = [];

  displayDialog: boolean = false;

  currentPost: Post;
  viewPost: Post;
  isLoadingUser: boolean = false;
  currentUser: User;

  selectAll: boolean = false;

  viewDialog: 'detail' | 'edit' | 'compare' = 'detail';

  getListPostSubscription: Subscription;

  getDetailSubscription: Subscription;

  getUserSubscription: Subscription;

  totalRecords: number = 0;

  first: number;
  globalFilter: string;
  multiSortMeta: SortMeta[];
  rows: number;
  sortField: string;
  sortOrder: number;
  filters: {
    [key: string]: [
      {
        value?: string;
        matchMode?: string;
        operator?: string;
      }
    ];
  };

  currentData: TableData;

  rowsPerPageOptions = [25, 50, 100, 200];
  RESULT_PAGE_SIZE = this.rowsPerPageOptions[0];
  selectedRow: number;

  statuses = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Private', value: 'Private' },
    { label: 'Deleted', value: 'Deleted' }
  ];

  @ViewChild('pendingContent') pendingContent: ElementRef;

  viewPendingContent: boolean = true;

  constructor(
    private managePostService: ManagePostService,
    private manageAdminUserService: ManageAdminUserService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.queryParams;
    this.selectedRow = params?.size || this.RESULT_PAGE_SIZE; 4
    this.rows = params?.size || this.RESULT_PAGE_SIZE;
    this.first = ((params.page - 1) >= 0 ? (params.page - 1) : 0) * this.rows;
    this.multiSortMeta = convertToMultiSortMeta(params.sortBy, params.orderBy);
    this.globalFilter = params.search || '';
    this.filters = params?.status ? {
      status: params?.status?.split(',').length > 0 ? params.status.split(',').map(item => {
        return {
          value: item,
          matchMode: 'contains',
          operator: 'and'
        }
      }) : [],
    } : {};
    this.sortField = params.sortBy || '';
    this.sortOrder = params.sortBy || 1;
    this.isLoading = false;
  }

  getListPost(data?: TableData) {
    if (this.getListPostSubscription) {
      this.getListPostSubscription.unsubscribe();
    }

    this.isLoadingTable = true;

    const params: ApiParams = this.getParams(data);

    this.getListPostSubscription = this.managePostService.getListPosts(params).subscribe(
      (res) => {
        this.isLoadingTable = false;
        this.listPosts = res.data.posts;

        this.totalRecords = res.data.total_size;

        this.listPosts.map(item => {
          item.fromNow = {
            created: convertDateTime(item.created_timestamp, 'en', true, false),
            approved: convertDateTime(item.approved_timestamp, 'en', true, false),
            updated: item.last_modified_timestamp ? convertDateTime(item.last_modified_timestamp, 'en', true, false) : '',
          }
        });
      },
      (err) => {
        this.listPosts = [];
        this.isLoadingTable = false;
        this.messageService.add({
          key: 'manage-post',
          severity: 'error',
          summary: err.error,
          detail: err.message
        });
        this.error = true;
      }
    );
  }

  getPostDetail(id: number) {
    if (this.currentPost?.id === id) {
      return;
    }
    this.currentPost = null;

    if (this.getDetailSubscription) {
      this.getDetailSubscription.unsubscribe();
    }
    this.isLoadingDialog = true;

    this.getDetailSubscription = this.managePostService.getPostById(id).subscribe(
      (res) => {
        this.currentPost = res.data.post;

        if (this.viewPendingContent) {
          let pendingContent = { ...this.currentPost.pending_content };
          if (pendingContent.last_modified_timestamp) {
            delete pendingContent.last_modified_timestamp;
          }
          this.viewPost = { ...this.currentPost, ...pendingContent };
        }
        else {
          this.viewPost = _.cloneDeep(this.currentPost);
        }

        if (this.viewDialog === 'compare') {
          this.pendingContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.isLoadingDialog = false;
      },
      (err) => {
        this.isLoadingDialog = false;
        this.messageService.add({
          key: 'manage-post',
          severity: 'error',
          summary: err.error,
          detail: err.message
        });
        this.error = true;
      }
    );
  }

  getUserInfo(user_name: string) {
    if (this.currentUser?.user_name === user_name) {
      return;
    }
    if (this.getUserSubscription) {
      this.getUserSubscription.unsubscribe();
    }
    this.isLoadingUser = true;
    this.getUserSubscription = this.manageAdminUserService.getUserByUsername(user_name).subscribe(
      (res) => {
        this.isLoadingUser = false;
        this.currentUser = res.data.user;
      },
      (err) => {
        this.messageService.add({
          key: 'manage-post',
          severity: 'error',
          summary: err.error,
          detail: err.message
        });
      }
    );
  }

  loadPosts(event: TableData) {
    this.isLoading = false;
    console.log(event);
    this.currentData = event;
    this.router.navigate([], {
      queryParams: {
        ...this.getQuery(event)
      }
    });
    this.getListPost(event);
  }

  onClickViewDetail(id: number) {
    this.viewDialog = 'detail';
    this.displayDialog = true;
    this.getPostDetail(id);
  }

  onClickViewPendingContent(id: number) {
    this.viewDialog = 'compare';
    this.pendingContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.getPostDetail(id);
  }

  onClickApprove(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to approve this post?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Yes, approve it!",
      rejectLabel: "No, cancel",
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.isLoading = true;
        this.managePostService.approvePostByPostId(id).subscribe(
          () => {
            this.isLoading = false;
            this.listPosts = this.listPosts.map(item => {
              if (item.id === id) {
                item.status = 'Approved';
                item.approved_timestamp = new Date().toLocaleDateString();
              }
              return item;
            });
            this.displayDialog = false;
            this.messageService.add({
              key: 'manage-post',
              severity: 'success',
              summary: 'Approved',
              detail: 'Post approved successfully'
            });
          },
          (err) => {
            this.isLoading = false;
            this.messageService.add({
              key: 'manage-post',
              severity: 'error',
              summary: err.error,
              detail: err.message
            });
          }
        );
      }
    });
  }

  onClickReject(id: number, pending: boolean = false) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to reject this post?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Yes, reject it!",
      rejectLabel: "No, cancel",
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLoading = true;
        this.managePostService.rejectPostByPostId(id, pending).subscribe(
          () => {
            this.isLoading = false;
            this.listPosts = this.listPosts.map(item => {
              if (item.id === id) {
                item.status = 'Rejected';
              }
              return item;
            });
            this.messageService.add({
              key: 'manage-post',
              severity: 'success',
              summary: 'Rejected',
              detail: 'Post rejected successfully'
            });
          },
          (err) => {
            this.isLoading = false;
            this.messageService.add({
              key: 'manage-post',
              severity: 'error',
              summary: err.error,
              detail: err.message
            });
          }
        );
      }
    });
  }

  onChangeViewPendingContent(event) {
    if (event.checked) {
      this.viewPost = { ...this.currentPost, ...this.currentPost.pending_content };
    }
    else {
      this.viewPost = _.cloneDeep(this.currentPost);
    }
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedPosts = value;
  }

  onSelectAllChange(event) {
    const checked = event.checked;

    if (checked) {
      this.selectedPosts = this.listPosts;
      this.selectAll = true;
    }
    else {
      this.selectedPosts = [];
      this.selectAll = false;
    }
  }

  onChangeRows(event) {
    this.rows = event.value;
    this.loadPosts({
      ...this.currentData,
      rows: this.rows,
    });
  }

  getParams(data?: TableData): ApiParams {
    let params: ApiParams;
    if (!!data) {
      params = {
        start: data.first,
        size: data.rows,
        search_term: data.globalFilter ? data.globalFilter : null,
        status: data.filters?.status && data.filters?.status[0].value ? data.filters?.status.filter(item => !!item.value).map(item => item.value).join(',') : null,
        sort_by: data.multiSortMeta ? data.multiSortMeta.map(item => item.field).join(',') : null,
        order: data.multiSortMeta ? data.multiSortMeta.map(item => item.order === 1 ? 'desc' : 'asc').join(',') : null,
      }
    }
    else {
      params = {
        start: this.first,
        size: this.rows,
        search_term: this.globalFilter ? this.globalFilter : null,
        status: this.filters?.status && this.filters?.status[0].value ? this.filters?.status.filter(item => !!item.value).map(item => item.value).join(',') : null,
        sort_by: this.multiSortMeta ? this.multiSortMeta.map(item => item.field).join(',') : null,
        order: this.multiSortMeta ? this.multiSortMeta.map(item => item.order === 1 ? 'desc' : 'asc').join(',') : null,
      }
    }
    params = _.omitBy(params, _.isNull);
    return params;
  }

  getQuery(data?: TableData): ApiParams {
    let query: QueryParams;
    if (!!data) {
      query = {
        page: data.first / data.rows + 1,
        size: data.rows,
        search: data.globalFilter ? data.globalFilter : null,
        status: data.filters?.status && data.filters?.status[0].value ? data.filters?.status.filter(item => !!item.value).map(item => item.value).join(',') : null,
        sortBy: data.multiSortMeta ? data.multiSortMeta.map(item => item.field).join(',') : null,
        orderBy: data.multiSortMeta ? data.multiSortMeta.map(item => item.order === 1 ? 'desc' : 'asc').join(',') : null,
      }
    }
    else {
      query = {
        page: this.first / this.rows + 1,
        size: this.rows,
        search: this.globalFilter ? this.globalFilter : null,
        status: this.filters?.status && this.filters?.status[0].value ? this.filters?.status.filter(item => !!item.value).map(item => item.value).join(',') : null,
        sortBy: this.multiSortMeta ? this.multiSortMeta.map(item => item.field).join(',') : null,
        orderBy: this.multiSortMeta ? this.multiSortMeta.map(item => item.order === 1 ? 'desc' : 'asc').join(',') : null,
      }
    }
    if (query.page === 1) {
      query.page = null;
    }
    if (query.size === this.rowsPerPageOptions[0]) {
      query.size = null;
    }
    query = _.omitBy(query, _.isNull);
    return query;
  }

  ngOnDestroy() {
    if (this.getListPostSubscription) {
      this.getListPostSubscription.unsubscribe();
    }

    if (this.getDetailSubscription) {
      this.getDetailSubscription.unsubscribe();
    }
  }

}
