interface MessageData {
  creationTime: string;
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  reactions: [];
  creationDate: number;
  id: number;

}

export class Message {
  sender: string;
  profileImg: string;
  content: string;
  thread: string;
  reactions: [];
  timeWhenCreated: string;
  creationDate: number;
  id: number;
  creationTime: string;
  constructor(data?: MessageData) {
    this.sender = data?.sender || '';
    this.content = data?.content || '';
    this.profileImg = data?.profileImg || '';
    this.thread = data?.thread || '';
    this.reactions = data?.reactions || [];
    this.creationDate = data?.creationDate || 0;
    this.creationTime = data?.creationTime;
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
      id: this.id,
    };
  }
}
