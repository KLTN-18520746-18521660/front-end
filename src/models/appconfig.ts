export interface AppConfig {
  inputStyle?: string;
  dark?: boolean;
  theme?: string;
  ripple?: boolean;
}

export interface PublicConfig {
  SessionAdminUserConfig?: {
    expiry_time?: number,
    extension_time?: number
  },
  SessionSocialUserConfig?: {
    expiry_time?: number,
    extension_time?: number
  }
}