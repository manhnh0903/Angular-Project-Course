export class Channel {
  name: string;
  description: string;
  users: any[] = [];
  id;
  messages = []
  constructor(obj?: any) {
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.users = obj?.users || [];
    this.messages = obj?.messages || [];
    this.id = obj?.description || '';
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      users: this.users,
      messages: this.messages,
      id: this.id
    };
  }
}
