export const APPCONSTANT = {
  // PLACEHOLDER_IMAGE: 'assets/images/placeholder-image.jpg',
  PLACEHOLDER_IMAGE: 'assets/images/svg/thumbnail-placeholder.svg',
  TOAST_TIMEOUT: 6000,
  LOADING_TIMEOUT: 2000,
  FONT_SIZE: 13,
  USER_IDLE: {
    IDLE: 30,
    // should be TIMEOUT == PING 
    TIMEOUT: 10,
    PING: 10
  },
  SESSION_TIMEOUT_DEFAULT: 5
}

export const CONTACT_INFO = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'pi-facebook',
    color: '',
    style: 'p-button-rounded'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'pi-twitter',
    color: 'p-button-info',
    style: 'p-button-rounded'
  },
  {
    id: 'youtube',
    name: 'Youtube',
    icon: 'pi-youtube',
    color: 'p-button-danger',
    style: 'p-button-rounded'
  },
  {
    id: 'github',
    name: 'Github',
    icon: 'pi-github',
    color: 'p-button-secondary',
    style: 'p-button-rounded'
  }
];

export const BREAKPOINT = {
  xs: 480,
  sm: 600,
  md: 768,
  lg: 992,
  xl: 1200
}

export const STORAGE_KEY = {
  USER_SESSIONS_TOKEN: 'session_token',
  CURRENT_USER: 'CURRENT_USER',
  USER_REMEMBER: 'X-USER-REMEMBER',

  ADMIN_SESSIONS_TOKEN: 'session_token_admin',
  ADMIN_INFO: 'X-ADMIN-INFO',
  ADMIN_REMEMBER: 'X-ADMIN-REMEMBER',

  POST_DRAFT: 'POST-DRAFT',
}