export class Channel {
    name: string;
    description: string;

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description
        }
    }
}