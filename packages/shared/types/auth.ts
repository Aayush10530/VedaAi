export interface User {
  _id: string;
  name: string;
  email: string;
  schoolName: string;
  createdAt?: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  schoolName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
