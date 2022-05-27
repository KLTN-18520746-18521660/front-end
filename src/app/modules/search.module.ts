import { SearchPageComponent } from 'pages/SearchPage/SearchPage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchAllComponent } from 'components/Searchs/search-all/search-all.component';
import { SearchPostComponent } from 'components/Searchs/search-post/search-post.component';
import { SearchUserComponent } from 'components/Searchs/search-user/search-user.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: SearchPageComponent, children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          { path: 'all', component: SearchAllComponent },
          { path: 'post', component: SearchPostComponent },
          { path: 'user', component: SearchUserComponent },
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class SearchModule { }
