interface UserData {
  name: string;
  email: string;
  userId: string;
  profileImg: string;
  onlineStatus: boolean;
  directMessages: [{}];
  chanels: [];
  password: string;
}

export class DabubbleUser {
  name: string;
  email: string;
  userId: string;
  profileImg: string;
  onlineStatus: boolean;
  directMessages: [{}];
  chanels: [];

  password: string;

  constructor(data?: UserData) {
    this.name = data?.name || '';
    this.email = data?.email || '';
    this.userId = data?.userId || '';
    this.profileImg = data?.profileImg || '';
    this.onlineStatus = data?.onlineStatus || false;
    this.directMessages = data?.directMessages || [
      { user: 'Test', profileImg: 'img1' },
    ];
    this.chanels = data?.chanels || [];

    this.password = data?.password || '';
  }

  toJson() {
    return {
      name: this.name,
      email: this.email,
      userId: this.userId,
      profileImg: this.profileImg,
      onlineStatus: this.onlineStatus,
      directMessages: this.directMessages,
      chanels: this.chanels,

      password: this.password, //passwort besser nicht abspeichern??
    };
  }
}
