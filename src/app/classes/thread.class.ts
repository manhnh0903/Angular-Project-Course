export class Thread {

    sender: string;
    profileImg: string;
    message: string;

    constructor(data) {

        this.sender = data?.sender || '';
        this.message = data?.message || '';
        this.profileImg = data?.profileImg || '';
    }
    toJson() {
        return {
            name: this.sender,
            message: this.message,
            profileImg: this.profileImg,

        };
    }
}