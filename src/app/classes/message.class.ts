interface MessageData {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  reactions: [];
  // sendTime: number;
}

export class Message {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  reactions: [];
  // sendTime: number;

  constructor(data?: MessageData) {
    this.sender = data?.sender || '';
    this.content = data?.content || '';
    this.profileImg = data?.profileImg || '';
    this.thread = data?.thread || '';
    this.reactions = data?.reactions || [];
    // this.sendTime = new Date().getTime();
  }

  toJSON() {
    return {
      sender: this.sender,
      profileImg: this.profileImg,
      content: this.content,
      thread: this.thread,
      reactions: this.reactions,
      // sendTime: this.sendTime,
    };
  }
}
