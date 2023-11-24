interface ConversationData {
  userId1: string;
  userId2: string;
  messages: [];
}

export class Conversation {
  userId1: string;
  userId2: string;
  messages: [];

  constructor(data?: ConversationData) {
    this.userId1 = data?.userId1 || '';
    this.userId2 = data?.userId2 || '';
    this.messages = data?.messages || [];
  }

  toJson() {
    return {
      userId1: this.userId1,
      userId2: this.userId2,
      messages: this.messages,
    };
  }
}
