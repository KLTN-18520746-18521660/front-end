import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss']
})
export class UserInfoCardComponent implements OnInit {

  user: any = {
    id: 1,
    fullname: 'John Doe',
    username: 'john_doe05',
    email: 'john@doe.com',
    phone: '+1 (555) 555-5555',
    country: 'USA',
    isVip: false,
    dateOfBirth: new Date(),
    avatar: 'https://randomuser.me/api/portraits/',
    bio: 'I am font-end developer with 3 year experience. I can find bugs and fix them. I am very good at HTML, CSS, JavaScript, TypeScript, Angular, React, and more. I will be working with other languages. Contact me at https://github.com/john, let me know what you are doing and i will help you to get started. I am very happy to help you. By me a coffee on http://paypal.com/john.           Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi alias deleniti facere ex recusandae fuga quam ea adipisci iusto? Explicabo quos amet vitae minima quaerat alias repellat laudantium iste animi.',
    skills: [
      'Angular',
      'React',
      'HTML',
    ],
    social: [
      'http://facebook.com/john.doe',
      'http://twitter.com/john.doe'
    ],
    values: {
      post: 1,
      following: 12099,
      follower: 12,
      view: 213131,
      like: 1231,
    }
  }

  isFollowing: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  checkisFollowing() {
    this.isFollowing = false;
  }

  onClickFollow() {
    if (this.isFollowing) {
      this.user.values.following--;
    }
    else {
      this.user.values.following++;
    }
    this.isFollowing = !this.isFollowing;
  }

}
