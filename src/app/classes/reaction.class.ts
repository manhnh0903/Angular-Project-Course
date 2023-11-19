export class Reaction {
    id;
    name;
    colons;
    text;
    emoticons;
    skin;
    native;
    counter;
    userIDs
    constructor(data?) {
        this.id = data?.id || '';
        this.name = data?.name || '';
        this.colons = data?.colons || '';
        this.text = data?.text;
        this.emoticons = data?.emoticons || [];
        this.skin = data?.skin || '';
        this.native = data?.native || '';
        this.counter = data?.counter || '';
        this.userIDs = data?.userIDs || []
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            colons: this.colons,
            text: this.text,
            emoticons: this.emoticons,
            skin: this.skin,
            native: this.native,
            counter: this.counter,
            userIDs: this.userIDs
        };
    }
}