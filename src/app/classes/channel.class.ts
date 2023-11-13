export class Channel {
    name: string;
    description: string;
    users: any[] = [];
  
    constructor(obj?: any) {
      this.name = obj?.name || '';
      this.description = obj?.description || '';
      this.users = obj?.users || [];
    }
  
    toJSON() {
      return {
        name: this.name,
        description: this.description,
        users: this.users,
      };
    }
  }
  