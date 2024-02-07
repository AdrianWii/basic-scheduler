export class Meeting {
    title: string;
    startTime: Date;
    participants: []|string[];

    constructor(title: string, startTime: Date, participants: []|string[]) {
        this.title = title;
        this.startTime = startTime;
        this.participants = participants;
    }
}