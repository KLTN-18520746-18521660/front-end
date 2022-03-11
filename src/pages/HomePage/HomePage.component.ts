import { Component, OnInit } from '@angular/core';
import { UserConfigService } from 'services/user-config.service';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.scss']
})
export class HomePageComponent implements OnInit {

  isGrid: boolean = false;
  layout: string;
  viewOption: string;

  layoutOptions: any[];

  contacts = [{
    id: 'facebook',
    name: 'Facebook',
    icon: 'pi-facebook',
    color: '',
    style: 'p-button-rounded'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'pi-twitter',
    color: 'p-button-info',
    style: 'p-button-rounded'
  },
  {
    id: 'youtube',
    name: 'Youtube',
    icon: 'pi-youtube',
    color: 'p-button-danger',
    style: 'p-button-rounded'
  },
  {
    id: 'github',
    name: 'Github',
    icon: 'pi-github',
    color: 'p-button-secondary',
    style: 'p-button-rounded'
  }];

  tags = [
    {
      id: 'angular',
      name: 'Angular',
      color: '#dd0031'
    },
    {
      id: 'react',
      name: 'React',
      color: '#00dd31'
    },
    {
      id: 'vue',
      name: 'Vue',
      color: '#0031dd'
    },
    {
      id: 'nodejs',
      name: 'NodeJS',
      color: '#dd0031'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      color: '#0031dd'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      color: '#dd0031'
    },
    {
      id: 'css',
      name: 'CSS',
      color: '#0031dd'
    },
    {
      id: 'html',
      name: 'HTML',
      color: '#dd0031'
    },
    {
      id: 'csharp',
      name: 'CSharp',
      color: '#0031dd'
    }
  ];

  listPosts = [
    {
      postId: 1,
      title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
      thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
      owner: {
        uid: 2,
        username: 'Jenny Wilson',
        avatar: 'https://via.placeholder.com/150x150'
      },
      created_at: '2022-03-03 12:00:00',
      time_read: '1',
      view: 3200,
      comments: 125121,
      likes: 30210,
      tags: [{
        id: 'angular',
        name: 'Angular'
      },
      {
        id: 'javascript',
        name: 'JavaScript'
      },
      {
        id: 'typescript',
        name: 'TypeScript'
      }]
    },
    {
      postId: 1,
      title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
      thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
      owner: {
        uid: 2,
        username: 'Jenny Wilson',
        avatar: 'https://via.placeholder.com/150x150'
      },
      created_at: '2022-03-03 12:00:00',
      time_read: '1',
      view: '30',
      comments: 5,
      likes: 30,
      tags: [{
        id: 'angular',
        name: 'Angular'
      },
      {
        id: 'javascript',
        name: 'JavaScript'
      },
      {
        id: 'typescript',
        name: 'TypeScript'
      }]
    },
    {
      postId: 1,
      title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
      thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
      owner: {
        uid: 2,
        username: 'Jenny Wilson',
        avatar: 'https://via.placeholder.com/150x150'
      },
      created_at: '2022-03-03 12:00:00',
      time_read: '1',
      view: '30',
      comments: 5,
      likes: 30,
      tags: [{
        id: 'angular',
        name: 'Angular'
      },
      {
        id: 'javascript',
        name: 'JavaScript'
      },
      {
        id: 'typescript',
        name: 'TypeScript'
      }]
    },
    {
      postId: 1,
      title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
      thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
      owner: {
        uid: 2,
        username: 'Jenny Wilson',
        avatar: 'https://via.placeholder.com/150x150'
      },
      created_at: '2022-03-03 12:00:00',
      time_read: '1',
      view: '30',
      comments: 5,
      likes: 30,
      tags: [{
        id: 'angular',
        name: 'Angular'
      },
      {
        id: 'javascript',
        name: 'JavaScript'
      },
      {
        id: 'typescript',
        name: 'TypeScript'
      }]
    },
    {
      postId: 1,
      title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
      thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
      owner: {
        uid: 2,
        username: 'Jenny Wilson',
        avatar: 'https://via.placeholder.com/150x150'
      },
      created_at: '2022-03-03 12:00:00',
      time_read: '1',
      view: '30',
      comments: 5,
      likes: 30,
      tags: [{
        id: 'angular',
        name: 'Angular'
      },
      {
        id: 'javascript',
        name: 'JavaScript'
      },
      {
        id: 'typescript',
        name: 'TypeScript'
      }]
    }
  ]

  constructor(private userConfigService: UserConfigService) {
    this.layoutOptions = [
      { icon: 'pi pi-align-justify', value: 'list' },
      { icon: 'pi pi-th-large', value: 'grid' },
    ];

    const _layout = this.userConfigService.getConfigByKey('layout') || 'list';
    this.layout = _layout;
    this.isGrid = _layout === 'grid' ? true : false;
    
    this.viewOption = this.userConfigService.getConfigByKey('viewOption') || 'foryou';
  }

  ngOnInit() {
  }

  onChangeLayout(e) {
    this.isGrid = !this.isGrid;
    this.userConfigService.addConfig('layout', e.value);
  }

  onChangeViewOption(e) {
    this.viewOption = e;
    this.userConfigService.addConfig('viewOption', e);
  }
}
