interface UserData {
  email: string;
  password: string;
  name: string;
  profileImg: string;
}

export class DabubbleUser {
  email: string;
  password: string;
  name: string;
  profileImg: string;

  constructor(data?: UserData) {
    this.name = data?.name || '';
    this.email = data?.email || '';
    this.password = data?.password || '';
    this.profileImg = data?.profileImg || '';
  }

  asJson() {
    return {
      name: this.name,
      email: this.email,
      // password: this.password, //passwort besser nicht abspeichern??
      profileImg: this.profileImg,
    };
  }
}
