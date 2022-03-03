import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  tags = []
  params = {
    name: "Vinh"
  }
  constructor() { }

  ngOnInit() {
    this.tags = [
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
      // {
      //   id: 'css',
      //   name: 'CSS',
      //   color: '#0031dd'
      // },
      // {
      //   id: 'html',
      //   name: 'HTML',
      //   color: '#dd0031'
      // },
      // {
      //   id: 'csharp',
      //   name: 'C#',
      //   color: '#0031dd'
      // }
    ]
  }

}
