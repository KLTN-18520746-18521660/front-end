export default class User {
  id: string;
  description?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  user_name: string;
  password?: string;
  email?: string;
  sex?: string;
  phone?: string;
  country?: string;
  city?: string;
  province?: string;
  verified_email?: boolean;
  avatar?: string;
  status?: string;
  settings?: object;
  ranks?: object;
  values?: {
    post?: number;
    following?: number;
    follower?: number;
    view?: number;
    like?: number;
  };
  public?: [];
  created_timestamp?: string;
  last_access_timestamp?: string;
  fromNow?: {
    created?: string;
    updated?: string;
  }
}

export class AdminUser {
  id: string;
  user_name: string;
  display_name: string;
  email: string;
  status?: string;
  settings?: object;
  created_timestamp?: string;
  last_access_timestamp?: string;
}

export class SignUpUserModel {
  first_name: string;
  last_name: string;
  user_name: string = "aassasasssssas";
  email: string;
  password: string;
  confirm_password: string;

  constructor(params: any) {
    this.email = params?.email;
    this.password = params?.password;
    this.confirm_password = params?.confirm_password;
    this.first_name = params?.first_name;
    this.last_name = params?.last_name;
  }
}

export class LoginUserModel {
  user_name: string;
  password: string;
  remember: boolean = false;
  data: object = {};

  constructor(params: any) {
    this.user_name = params?.user_name;
    this.password = params?.password;
    this.remember = params?.remember;
    this.data = params?.data;
  }
}