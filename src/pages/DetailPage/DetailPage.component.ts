import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import mermaid from 'mermaid';
import { CommentService } from 'services/comment.service';
import Comment from 'models/comment.model';
import { ActivatedRoute } from '@angular/router';
import { CONTACT_INFO } from 'utils/appConstant';
import Post from 'models/post.model';
import { postsMockData } from 'shared/mockData/postsMockData';
import { randomArray } from 'utils/commonFunction';

@Component({
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

  breadcrumbItems: MenuItem[];

  home: MenuItem;

  markdown =
    `
# Dillinger
## _The Last Markdown Editor, Ever_


[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Dillinger is a cloud-enabled, mobile-ready, offline-storage compatible,
AngularJS-powered HTML5 Markdown editor.

- Type some Markdown on the left
- See HTML in the right
- ✨Magic ✨

## Features

- Import a HTML file and watch it magically convert to Markdown
- Drag and drop images (requires your Dropbox account be linked)
- Import and save files from GitHub, Dropbox, Google Drive and One Drive
- Drag and drop markdown and HTML files into Dillinger
- Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions
that people naturally use in email.
As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually- written in Markdown! To get a feel
for Markdown's syntax, type some text into the left window and
watch the results in the right.

## Tech

Dillinger uses a number of open source projects to work properly:

- [AngularJS] - HTML enhanced for web apps!
- [Ace Editor] - awesome web-based text editor
- [markdown-it] - Markdown parser done right. Fast and easy to extend.
- [Twitter Bootstrap] - great UI boilerplate for modern web apps
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework [@tjholowaychuk]
- [Gulp] - the streaming build system
- [Breakdance](https://breakdance.github.io/breakdance/) - HTML
to Markdown converter
- [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.


## Plugins

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |

## Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
## Docker

Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>

`;

  menuitem: MenuItem[] = [
    {
      id: 'edit',
      label: '',
      icon: 'pi pi-pencil',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'save',
      label: '',
      icon: 'pi pi-bookmark-fill',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'copy',
      label: '',
      icon: 'pi pi-copy',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'share',
      label: '',
      icon: 'pi pi-share-alt',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'report',
      label: '',
      icon: 'pi pi-flag-fill',
      command: (event) => {
        console.log(event);
      }
    }
  ]

  post: Post;

  slug: string;

  contacts = CONTACT_INFO;

  listComments: any[];

  numberComments: number;

  filterComments: any[];

  currentFilter: object;

  isLoadingComments: boolean = false;

  listRecommend: Post[] = [];

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.listRecommend = randomArray(postsMockData, 6);
    this.post = randomArray(postsMockData, 1, true);
    this.slug = this.activatedRoute.snapshot.params.slug;

    this.breadcrumbItems = [
      { label: 'Technology', url: 'technology' },
      { label: 'Angular', url: 'tag/angular' }
    ];

    this.numberComments = this.commentService.getNumberComments(this.post.id);

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.post.fromNow = {
      created: dayjs(this.post.created_timestamp).fromNow(),
      updated: dayjs(this.post.last_modified_timestamp).fromNow() || null
    }

    this.translate.get('postDetail.action').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuitem.map((item, index) => {
        item.label = result[index]
      })
    });

    this.translate.get('postDetail.commentFilter').subscribe((res) => {
      this.filterComments = [
        {
          label: '',
          value: 'created_timestamp-desc'
        },
        {
          label: '',
          value: 'created_timestamp-asc'
        },
        {
          label: '',
          value: 'like-desc'
        },
        {
          label: '',
          value: 'like-asc'
        },
      ];
      let result = Object.values(res) as [];
      this.filterComments.map((item, index) => {
        item.label = result[index]
      });

      this.currentFilter = this.filterComments[0];
    });

    this.titleService.setTitle(this.post.title);

    // Config markdown view mermaid
    mermaid.initialize({
      securityLevel: 'loose'
    });
    mermaid.init();
  }

  onTextChange(event) {
    console.log(event)
  }

  onSubmitComment() {
  }

  initLoadComment() {
    this.isLoadingComments = true;
    setTimeout(() => {
      this.listComments = this.commentService.getComments(this.post.id);
      this.onFilterComments({ value: this.currentFilter });
      this.isLoadingComments = false;
    }, 1000);
  }

  onFilterComments(event) {
    this.currentFilter = event.value;
    const getParams = event.value.value.split('-');
    this.commentService.sortComments(getParams[0], getParams[1]);
    this.listComments = [];
    this.listComments = this.commentService.getComments(this.post.id);
  }

}
