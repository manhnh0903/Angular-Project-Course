export class User {
  name: string;
  email: string;

  constructor(data) {
    this.name = data.name || '';
    this.email = data.email || '';
  }
}
