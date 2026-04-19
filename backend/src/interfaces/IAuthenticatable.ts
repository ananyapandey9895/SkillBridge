export interface IAuthenticatable {
  login(email: string, password: string): Promise<string>;
  logout(): void;
}
