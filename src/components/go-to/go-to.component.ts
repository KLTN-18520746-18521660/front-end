import { PostsService } from 'services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-go-to',
  templateUrl: './go-to.component.html',
  styleUrls: ['./go-to.component.scss']
})
export class GoToComponent implements OnInit {

  url: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private postService: PostsService
  ) { }

  ngOnInit() {
    this.url = this.activatedRoute.snapshot.queryParams.url || null;
    // this.postService.gotoUrl(res.url).subscribe(
    //   () => {
        setTimeout(() => {
          if (this.url) {
            this.router.ngOnDestroy();
            window.location.href = this.url;
          }
          else {
            this.router.navigate(['/']);
          }
        }, 2000);
    //   },
    //   () => {
    //     this.router.navigate(['/']);
    //   }
    // );
  }
}
