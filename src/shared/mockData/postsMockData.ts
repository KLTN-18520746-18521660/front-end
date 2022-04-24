import Post from "models/post.model";
import { randomArray } from "utils/commonFunction";
import { tagsMockData } from "./tagsMockData";

export const postsMockData: Post[] = [
  {
    id: 1,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
    owner: {
      id: 2,
      display_name: 'Jenny Wilson',
      user_name: 'jennyw',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 15,
    views: 450,
    comments: 23,
    likes: 30210,
    dislikes: 12,
    visited_count: 5,
    tags: randomArray(tagsMockData, 3)
  },
  {
    id: 2,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://media.bitdegree.org/storage/media/images/2018/08/what-is-a-web-developer.jpg',
    owner: {
      id: 3,
      display_name: 'Jenny Wilson',
      user_name: 'jennyw',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 125121,
    likes: 9,
    dislikes: 0,
    visited_count: 5,
    tags: randomArray(tagsMockData, 5)
  },
  {
    id: 3,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://d1iv5z3ivlqga1.cloudfront.net/wp-content/uploads/2021/08/11150618/ho-la-nhung-developer-su-dung-ngon-ngu-lap-trinh-php-de-thiet-ke-phan-mem-1024x576.jpg',
    owner: {
      id: 111,
      display_name: 'Jenny Wilson',
      user_name: 'jennyw',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 25,
    views: 34534,
    comments: 0,
    likes: 450,
    dislikes: 0,
    visited_count: 5,
    tags: randomArray(tagsMockData, 1)
  },
  {
    id: 4,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/tester-or-developer-what-suits-you-the-most.jpg',
    owner: {
      id: 25,
      display_name: 'Colin Wilson',
      user_name: 'colinw',
      avatar: ''
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 212,
    comments: 1424,
    likes: 0,
    dislikes: 8,
    visited_count: 5,
    tags: randomArray(tagsMockData, 5)
  },
  {
    id: 5,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuAqaTfcMMb2iIDG6B53q2c1d4F5kUs04Y4cwMs6VAbFmCQ3BWo60CAt8v6jFI11lSHWY&usqp=CAU',
    owner: {
      id: 4,
      display_name: 'Prashan Wilson',
      user_name: 'prashanw',
      avatar: ''
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 8,
    views: 45,
    comments: 0,
    likes: 7870,
    dislikes: 1378192,
    visited_count: 5,
    tags: randomArray(tagsMockData, 6)
  },
  {
    id: 6,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: '',
    owner: {
      id: 14,
      display_name: 'Wilson',
      user_name: 'wilson',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 125121,
    likes: 30210,
    dislikes: 17281,
    visited_count: 5,
    tags: randomArray(tagsMockData, 4)
  },
  {
    id: 7,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://number8.com/wp-content/uploads/2021/01/2021-software-development-salary-trends.png',
    owner: {
      id: 75,
      display_name: 'Hary Wilson',
      user_name: 'haryw',
      avatar: ''
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 0,
    likes: 30210,
    dislikes: 179281,
    visited_count: 5,
    tags: randomArray(tagsMockData, 3)
  },
  {
    id: 8,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://hocvienagile.com/wp-content/uploads/2021/04/Senior-Dev.jpg',
    owner: {
      id: 247,
      display_name: 'Messi',
      user_name: 'messi',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 125121,
    likes: 30210,
    dislikes: 0,
    visited_count: 5,
    tags: randomArray(tagsMockData, 2)
  },
  {
    id: 9,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://www.elmhurst.edu/wp-content/uploads/2019/11/software-developer-vs-software-engineer-illustration.jpg',
    owner: {
      id: 2012,
      display_name: 'Thom Wilson',
      user_name: 'thomw',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 0,
    likes: 30210,
    dislikes: 12761892,
    visited_count: 5,
    tags: randomArray(tagsMockData, 7)
  },
  {
    id: 10,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://backlog.com/wp-blog-app/uploads/2019/08/Backlog-Succeeding-as-software-developer-in-modern-workforce-Blog.png',
    owner: {
      id: 1411,
      display_name: 'Vinh Ngoc',
      user_name: 'vinhngoc',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 125121,
    likes: 0,
    dislikes: 1217,
    visited_count: 5,
    tags: randomArray(tagsMockData, 6)
  },
  {
    id: 11,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://toidicodedao.files.wordpress.com/2019/07/which-programming-langauge-should-i-learn-first-itonlinelearning.jpg?w=672&h=372&crop=1',
    owner: {
      id: 1411,
      display_name: 'Vinh Ngoc',
      user_name: 'vinhngoc',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 125121,
    likes: 30210,
    dislikes: 0,
    visited_count: 5,
    tags: randomArray(tagsMockData, 2)
  },
  {
    id: 12,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: `<h1>The three greatest things you learn from traveling</h1><p><br></p><p><br></p><h3><span style="color: rgb(92, 0, 0);">Appreciation of diversity</span></h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><p><br></p><p><br></p><blockquote>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</blockquote><blockquote>Marcel Proust</blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>Sign in to your Google Account.</li><li>On the left, click Personal info.</li><li>Under "General preferences for the web," click Language Edit .</li><li>Search for and select your preferred language.</li><li>Click Select.</li><li>If you understand multiple languages, click + Add another language.</li></ul>`,
    short_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://www.michaelpage.com.vn/sites/michaelpage.com.vn/files/styles/advice_node_desktop/public/2022-01/Frontend%20Developer.jpg?itok=Gs7_TIJS',
    owner: {
      id: 1411,
      display_name: 'Vinh Ngoc',
      user_name: 'vinhngoc',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: '2020-01-01T00:00:00.000Z',
    last_modified_timestamp: '2022-01-01T00:00:00.000Z',
    time_read: 5,
    views: 3200,
    comments: 125121,
    likes: 30210,
    dislikes: 0,
    visited_count: 5,
    tags: randomArray(tagsMockData, 5)
  },
];