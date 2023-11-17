export interface GithubUser {
  id: number;
  github_username: string;
  name: string;
  email: string;
  come_from: string;
  location: string;
  blog: string;
  twitter_username: string;
}

export interface UsernameCreation {
  github_username: string;
  username: string;
}