export const REST_URL = {
  USER_LOGIN: 'login',
  USER_SIGNUP: 'signup',
  USER_LOGOUT: 'logout',
  GET_USER_BY_SESSIONID: 'session/user',
  GET_USER_BY_APIKEY: 'getuser',
  GET_USER_BY_ID: 'getUserById',
  GET_USER_BY_USERNAME: 'getUserByUsername',
  GET_USER_BY_EMAIL: 'getUserByEmail',
  GET_ALL_SESSION_USER: 'sessions',
  EXTENSION_SESSION_USER: 'session',
  DELETE_SESSION_USER: 'session',
  CONFIRM_USER: 'user/confirm',

  ADMIN_LOGIN: 'admin/login',
  ADMIN_SIGNUP: 'admin/logout',
  CREATE_ADMIN_USER: 'admin/user',
  GET_ADMIN_USER_BY_APIKEY: 'admin/user',
  GET_ADMIN_USER_BY_ID: 'admin/user',
  GET_ALL_SESSION_ADMIN_USER: 'admin/sessions',
  EXTENSION_SESSION_ADMIN_USER: 'admin/session',
  DELETE_SESSION_ADMIN_USER: 'admin/session',
  
}

export const REST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};