interface MessageData {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
}

export class Message {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  constructor(data?: MessageData) {
    this.sender = data?.sender || '';
    this.content = data?.content || '';
    this.profileImg = data?.profileImg || '';
    this.thread = data?.thread 
  }

  toJSON() {
    return {
      sender: this.sender,
      profileImg: this.profileImg,
      content: this.content,
      thread: this.thread
    };
  }
}
