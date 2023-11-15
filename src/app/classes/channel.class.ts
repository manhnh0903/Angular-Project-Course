export class Channel {
  name: string;
  description: string;
  users: any[] = [];
  id;
  messages
  constructor(obj?: any) {
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.users = obj?.users || [];
    this.id = '';
    this.messages = []
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      users: this.users,
      id: this.id,
      messages: this.messages
    };
  }
}
