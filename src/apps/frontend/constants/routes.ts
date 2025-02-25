const routes = {
  ABOUT: '/about',
  DASHBOARD: '/',
  DOCUMENTATION: '/api/documentation',
  FORGOT_PASSWORD: '/forgot-password',
  LOGIN: '/login',
  RESET_PASSWORD: '/accounts/:accountId/reset_password',
  OTP: '/login?auth_mode=otp',
  PHONE_LOGIN: '/signup?auth_mode=otp',
  PROFILE: '/profile',
  PROFILE_SETTINGS: '/profile/settings',
  SIGNUP: '/signup',
  TASKS: '/tasks',
  //COMMENTS: '/comments/:taskId',
  COMMENTS: '/tasks/:taskId/comments',
};

export default routes;
