export interface AuthSendLoginUser {
  username_or_email: string;
  password: string;
}

export interface AuthReceiveLoginUser {
  username_or_email: string;
  access_token: string;
}