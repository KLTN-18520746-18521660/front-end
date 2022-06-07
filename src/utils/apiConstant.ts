export const REST_URL = {
  USER_LOGIN: 'login',
  USER_SIGNUP: 'signup',
  USER_LOGOUT: 'logout',
  GET_USER_BY_SESSIONID: 'session/user',

  AUDIT_LOG: 'auditlog',
  ACTION: 'action',

  SEARCH: "search",

  SESSION: 'session',
  EXTENSION_SESSION_USER: 'session/extension',
  DELETE_ALL_SESSION: 'session/removeall',

  CONFIRM_USER: 'user/confirm',
  CONFIG: 'config',


  CHANGE_PASSWORD: 'user/changepassword',
  FORGOT_PASSWORD: 'user/forgotpassword',

  USER: 'user',
  FOLLOWER: 'follower',
  FOLLOWING: 'following',

  LINK_REDIRECT: 'goto',

  POST: 'post',
  POST_ID: 'post/id',
  POST_USER: 'post/user',
  POST_NEW: 'post/new',
  POST_RECOMMEND: 'post/recommend',
  POST_FOLLOWING: 'post/following',
  POST_TRENDING: 'post/trending',
  POST_VALUES: 'statistic',

  COMMENT: 'comment',
  COMMENT_POST: 'comment/post',

  NOTIFICATION: 'notification',
  NOTIFICATION_ID: 'notification/id',
  NOTIFICATION_READ: 'notification/read/id',
  NOTIFICATION_UNREAD: 'notification/unread/id',
  NOTIFICATION_ALL: 'notification/read/all',

  REPORT: 'report',

  CATEGORY: 'category',
  CATEGORY_TRENDING: 'category/trending',
  TAG: 'tag',
  TAG_TRENDING: 'tag/trending',

  ADMIN: {
    LOGIN: 'admin/login',
    LOGOUT: 'admin/logout',
    CREATE_ADMIN_USER: 'admin/user',
    GET_ADMIN_USER_BY_SESSIONID: 'admin/session/user',

    SESSION: 'admin/session',
    EXTEND_SESSION: 'admin/session/extension',

    CONFIG: 'admin/config',
    RELOAD_CONFIG: 'admin/config/reload',

    ADMIN: 'admin/user',

    USER: 'user',
    CHANGE_PASSWORD: 'admin/user/changepassword',
    FORGOT_PASSWORD: 'admin/user/forgotpassword',

    RIGHT_ADMIN: 'admin/right/admin',
    RIGHT_USER: 'admin/right/social',

    ROLE_ADMIN: 'admin/role/admin',
    ROLE_USER: 'admin/role/social',

    POST: 'admin/post',
    POSTS: 'admin/posts',
    APPROVE_POST: 'admin/post/approve',
    REJECT_POST: 'admin/post/reject',
  },

  UPLOAD: 'upload/file',
  UPLOADS: 'upload/files',

}

export type ActionType = 'like' | 'unlike' | 'dislike' | 'undislike' | 'save' | 'unsave' | 'follow' | 'unfollow' | 'report';

export const REST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};