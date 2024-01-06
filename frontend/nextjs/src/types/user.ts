interface User {
  id?: number;
  name?: string;
  company?: string;
  email?: string;
  shop_mail?: string;
  rms_shop_mail?: string;
  auth_id?: string;
  auth_password?: string;
  tel?: string;
  shopName?: string;
  shopUrl?: string;
  rakutenPlan?: string;
  get_limit?: number;
  serviceSecret?: string;
  licenseKey?: string;
  ftpPassword?: string;
  expiration?: string;
  email_verified_at?: string;
  UpdateStatus?: boolean;
  Authority?: string;
  trial?: string;
  must_verify_email?: boolean; // this is custom attribute
  created_at?: string;
  updated_at?: string;
}

type UserRegister = {
  company?: string;
  name?: string;
  email?: string;
  tel?: string;
  password?: string;
  passwordConfirmation?: string;
  skuProject?: boolean;
  rakutenPlan?: string;
  terms?: boolean;
};

type Login = {
  name: string;
  password: string;
  remember: boolean;
};

type ErrorData = {
  id: number;
  user_id: number;
  element: string;
  object: string;
  error: string;
  row: number | null;
  created_at: string;
  updated_at: string;
};

interface Search {
  paginate: number;
  order: string;
  sort: string;
  keyword: string;
  element: string;
}
