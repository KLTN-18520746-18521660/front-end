export const REST_URL = {
  USER_LOGIN: 'login',
  USER_SIGNUP: 'signup',
  USER_LOGOUT: 'logout',
  GET_USER_BY_SESSIONID: 'session/user',
  GET_USER_BY_APIKEY: 'getuser',
  GET_USER_BY_ID: 'getUserById',
  GET_USER_BY_USERNAME: 'getUserByUsername',
  GET_USER_BY_EMAIL: 'getUserByEmail',
  SESSION: 'session',
  EXTENSION_SESSION_USER: 'session/extension',
  DELETE_SESSION_USER: 'session',
  CONFIRM_USER: 'user/confirm',
  CONFIG: 'config',

  USER: 'user',
  FOLLOWER: 'follower',
  FOLLOWING: 'following',

  POST: 'post',
  POST_ID: 'post/id',
  POST_USER: 'post/user',
  POST_NEW: 'post/new',
  POST_FOLLOWING: 'post/following',
  POST_TRENDING: 'post/trending',
  POST_VALUES: 'statistic',

  COMMENT: 'comment',
  COMMENT_POST: 'comment/post',

  NOTIFICATION: 'notification',
  NOTIFICATION_ID: 'notification/id',
  NOTIFICATION_ALL: 'notification/id/all',

  REPORT: 'report',
  REPORT_COMMENT: 'report/comment',
  REPORT_POST: 'report/post',
  REPORT_USER: 'report/user',

  CATEGORY: 'category',
  TAG: 'tag',

  ADMIN: {
    LOGIN: 'admin/login',
    LOGOUT: 'admin/logout',
    CREATE_ADMIN_USER: 'admin/user',
    GET_ADMIN_USER_BY_SESSIONID: 'admin/session/user',

    SESSION: 'admin/session',
    EXTEND_SESSION: 'admin/session/extension',

    CONFIG: 'admin/config',
    RELOAD_CONFIG: 'admin/config/reload',

    POST: 'admin/post',
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