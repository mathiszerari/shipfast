export interface createUser {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface loginUser {
  username_or_email: string;
  password: string;
}