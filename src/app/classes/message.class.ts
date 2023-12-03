interface MessageData {
  creationTime: string;
  sender: string;
  profileImg: string;
  content: string;
  thread: any[];
  reactions: [];
  creationDate: number;
  id: number;
  creationDay: string
}

export class Message {
  sender: string;
  profileImg: string;
  content: string;
  thread: any[];
  reactions: [];
  timeWhenCreated: string;
  creationDate: number;
  id: number;
  creationTime: string;
  creationDay: string
  constructor(data?: MessageData) {
    this.sender = data?.sender || '';
    this.content = data?.content || '';
    this.profileImg = data?.profileImg || '';
    this.thread = data?.thread || [];
    this.reactions = data?.reactions || [];
    this.creationDate = data?.creationDate || 0;
    this.creationTime = data?.creationTime || '';
    this.creationDay = data?.creationDay || '';
    this.id = data?.id || 0;
  }

  toJSON() {
    return {
      sender: this.sender,
      profileImg: this.profileImg,
      content: this.content,
      thread: this.thread,
      reactions: this.reactions,
      creationDate: this.creationDate,
      creationTime: this.creationTime,
      creationDay: this.creationDay,
      id: this.id,
    };
  }
}
