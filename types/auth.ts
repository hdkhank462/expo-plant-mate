type UserInfo = {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_email_verified: boolean;
  date_joined: string;
  last_login: string;
  avatar_url: string;
  groups: string[];
  user_permissions: string[];
};

type AuthToken = {
  access: string;
  refresh: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
  user: UserInfo;
};

interface RegisterErrorResponse extends ApiError {
  email?: string[];
  password1?: string[];
  password2?: string[];
}

interface LoginErrorResponse extends ApiError {
  email?: string[];
  password?: string[];
}

type RefreshTokenResponse = {
  access: string;
  access_expiration: string;
};
