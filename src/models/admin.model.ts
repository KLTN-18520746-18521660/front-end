export class Admin {
  id: string;
  user_name?: string;
  display_name?: string;
  email?: string;
  status?: string;
  settings?: object;
  created_timestamp?: string;
  last_access_timestamp?: string;
}

export class AdminLoginModel {
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