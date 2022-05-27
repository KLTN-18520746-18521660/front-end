export interface AppConfig {
  inputStyle?: string;
  dark?: boolean;
  theme?: ThemeName;
  ripple?: boolean;
}

export type ThemeName = 'tailwind-light' | 'lara-dark-blue' | 'lara-light-blue';

export interface PublicConfig {
  SessionAdminUserConfig?: {
    expiry_time?: number;
    extension_time?: number;
  };
  SessionSocialUserConfig?: {
    expiry_time?: number;
    extension_time?: number;
  };
  UploadFileConfig?: {
    max_length_of_single_file?: number;
  };
  SocialUserIdle?: {
    idle?: number;
    timeout?: number;
    ping?: number;
  };
  AdminUserIdle?: {
    idle?: number;
    timeout?: number;
    ping?: number;
  };
  SocialPasswordPolicy?: PasswordPolicy;
  AdminPasswordPolicy?: PasswordPolicy;
  UIConfigs?: any;
}

export interface PasswordPolicy {
  min_len?: number;
  max_len?: number;
  min_lower_char?: number;
  min_upper_char?: number;
  min_number_char?: number;
  min_special_char?: number;
  expiry_time?: number;
  required_change_expired_password?: boolean;
}