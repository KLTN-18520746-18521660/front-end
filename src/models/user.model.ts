export default class User {
  id?: string;
  description?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  user_name?: string;
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
  ranks?: object;
  views?: number;
  posts?: number;
  likes?: number;
  followers?: number;
  following?: number;
  unread_notifications?: number;
  public?: string[];
  rights?: {
    comment?: UserRight;
    post?: UserRight;
    report: UserRight;
    upload?: UserRight;
  };
  roles?: string[];
  settings?: {
    confirm_email?: {
      confirm_date?: string;
      is_sending?: boolean;
      send_date?: string;
      send_success?: boolean;
      state?: string;
    };
    password?: {
      is_expired?: boolean;
      last_change_password?: string;
    };
  };
  created_timestamp?: string;
  last_access_timestamp?: string;
  fromNow?: {
    created?: string;
    updated?: string;
    password?: string;
  }
  actions?: string[];
  mapAction?: {
    follow: boolean;
    report: boolean;
  }

  constructor(params) {
    this.avatar = params.avatar;
    this.city = params.city;
    this.country = params.country;
    this.created_timestamp = params.created_timestamp;
    this.description = params.description;
    this.display_name = params.display_name;
    this.email = params.email;
    this.email = params.email;
    this.first_name = params.first_name;
    this.id = params.id;
    this.last_access_timestamp = params.last_access_timestamp;
    this.last_name = params.last_name;
    this.password = params.password;
    this.phone = params.phone;
    this.province = params.province;
    this.user_name = params.user_name;
  }
}

export interface UserRight {
  read?: boolean,
  write?: boolean,
};

export interface AuthUpdateUser {
  session_id?: string; 
  user?: User;
  isAuthenticated?: boolean; 
  remember?: boolean; 
  error?: boolean;
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
  user_name: string;
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