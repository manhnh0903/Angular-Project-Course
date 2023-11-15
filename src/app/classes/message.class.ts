interface MessageData {
  sender: string;
  profileImg: string;
  content: string;
}

export class message {
  sender: string;
  profileImg: string;
  content: string;

  constructor(data: MessageData) {
    this.sender = data?.sender || '';
    this.content = data?.content || '';
    this.profileImg = data?.profileImg || '';
    this.thread = data?.thread || undefined;
  }

  toJson() {
    return {
      name: this.sender,
      profileImg: this.profileImg,
      content: this.content,
      thread: this.thread
    };
  }
}
