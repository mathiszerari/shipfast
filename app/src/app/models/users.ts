export interface createUser {
  access_token: string;
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface sendLoginUser {
  username_or_email: string;
  password: string;
}

export interface receiveLoginUser {
  username_or_email: string;
  access_token: string;
}

export interface receiveUser {
  name: string;
  username: string;
  email: string;
}