interface UserData {
  name: string;
  email: string;
  profileImg: string;
  onlineStatus: boolean;
  directMasseges: [{}];
  chanels: [];
  password: string;
}

export class DabubbleUser {
  name: string;
  email: string;
  profileImg: string;
  onlineStatus: boolean;
  directMasseges: [{}];
  chanels: [];

  password: string;

  constructor(data?: UserData) {
    this.name = data?.name || '';
    this.email = data?.email || '';
    this.profileImg = data?.profileImg || '';
    this.onlineStatus = data?.onlineStatus || false;
    this.directMasseges = data?.directMasseges || [
      { user: 'Test', profileImg: 'img1' },
    ];
    this.chanels = data?.chanels || [];

    this.password = data?.password || '';
  }

  toJson() {
    return {
      name: this.name,
      email: this.email,
      profileImg: this.profileImg,
      onlineStatus: this.onlineStatus,
      directMasseges: this.directMasseges,
      chanels: this.chanels,

      password: this.password, //passwort besser nicht abspeichern??
    };
  }
}
