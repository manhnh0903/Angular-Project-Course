import { checkAuthResponse } from '../auth/interfaces/check-auth-response';

export class User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;

  constructor(data?: checkAuthResponse) {
    this.id = data?.id || -1;
    this.email = data?.email || '';
    this.username = data?.username || '';
    this.first_name = data?.first_name || '';
    this.last_name = data?.last_name || '';
  }

  asJson() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
    };
  }
}
