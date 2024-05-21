/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_USER_ROLE } from '../../../enums/user';

export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  username: string;
  role: string;
  email: string;
  userImage?: string;
  accessToken: string;
  refreshToken?: string;
  needPasswordChange: boolean;
  user?: any;
  data?: ILoginUserResponse | null | undefined;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IVerifiedLoginUser = {
  userId: string;
  role: ENUM_USER_ROLE;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
