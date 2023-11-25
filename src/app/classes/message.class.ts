interface MessageData {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  reactions: [];
  creationDate: number;
  id: number
}

export class Message {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  reactions: [];
  timeWhenCreated;
  creationDate;
  id;

  constructor(data?: MessageData) {
    this.sender = data?.sender || '';
    this.content = data?.content || '';
    this.profileImg = data?.profileImg || '';
    this.thread = data?.thread;
    this.reactions = data?.reactions || [];
    this.creationDate = data?.creationDate;
    this.id = data?.id;
  }

  toJSON() {
    return {
      sender: this.sender,
      profileImg: this.profileImg,
      content: this.content,
      thread: this.thread,
      reactions: this.reactions,
      creationDate: this.creationDate,
      id: this.id
    };
  }
}
