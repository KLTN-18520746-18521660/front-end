import User from "models/user.model";
import { addDay } from "utils/commonFunction";

export const usersMockData: User[] = [
  {
    id: '1',
    first_name: "Leanne",
    description: "I am font-end developer with 3 year experience. I can find bugs and fix them. I am very good at HTML, CSS, JavaScript, TypeScript, Angular, React, and more. I will be working with other languages. Contact me at https://github.com/john, let me know what you are doing and i will help you to get started. I am very happy to help you. By me a coffee on http://paypal.com/john. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi alias deleniti facere ex recusandae fuga quam ea adipisci iusto? Explicabo quos amet vitae minima quaerat alias repellat laudantium iste animi.",
    last_name: "Graham",
    user_name: "Bret",
    email: "bret@gmail.com",
    display_name: "Leanne Graham",
    sex: "Male",
    phone: "555-555-5555",
    country: "United States",
    city: "Washington",
    avatar: "https://placeimg.com/640/640",
    created_timestamp: addDay(-5, new Date()).toString(),
    last_access_timestamp: addDay(-2, new Date()).toString(),
    status: "Actived",
    values: {
      post: 5,
      following: 12,
      follower: 12113,
      view: 213131,
      like: 1231,
    },
    verified_email: true,
  },
  {
    id: '2',
    description: 'I am font-end developer with 3 year experience. I can find bugs and fix them. I am very good at HTML, CSS, JavaScript, TypeScript, Angular, React, and more. I will be working with other languages. Contact me at https://github.com/john, let me know what you are doing and i will help you to get started. I am very happy to help you. By me a coffee on http://paypal.com/john.',
    first_name: "Ervin",
    last_name: "Howell",
    user_name: "Antonette",
    email: "ervin@gmail.com",
    display_name: "Ervin Howell",
    sex: "Female",
    country: "United States",
    city: "California",
    avatar: "",
    created_timestamp: addDay(-7, new Date()).toString(),
    last_access_timestamp: addDay(-1, new Date()).toString(),
    status: "Actived",
    values: {
      post: 10,
      following: 2,
      follower: 75,
      view: 22531,
      like: 1215,
    },
    verified_email: true,
  }
]