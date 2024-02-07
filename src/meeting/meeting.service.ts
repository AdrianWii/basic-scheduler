import { IncomingMessage, ServerResponse } from 'http';
import { Meeting } from './meeting.entity';
import { log } from 'console';

class MeetingService {
    static meetings: Meeting[] = [
        new Meeting('Meeting 1', new Date('2024-02-07'), []),
        new Meeting('Meeting 2', new Date('2024-02-07'), [])
    ];

    static getMeetings(req: IncomingMessage, res: ServerResponse) {
        MeetingService.sendResponse(res, 200, MeetingService.meetings);
    }

    static async addMeeting(req: IncomingMessage, res: ServerResponse) {
        try {
            const body: string = await MeetingService.getBody(req);
            const { title, startTime, participants } = JSON.parse(body);

            if (!title || !startTime) {
                MeetingService.sendResponse(res, 400, { error: 'Missing parameters' });
                return;
            }

            const uniqueParticipants = MeetingService.removeDuplicateEmails(participants);
            //TODO validate if meetings for users have already scheduled in given time range
            const newMeeting = new Meeting(title, new Date(startTime), uniqueParticipants);
            this.meetings.push(newMeeting);
            MeetingService.sendResponse(res, 201, newMeeting);
            return;
        } catch (error) {
            MeetingService.sendResponse(res, 400, { error: 'Invalid JSON' });
            return;
        }
    }

    // This method filters meetings that match the given date, and two particpant emails, and then iterates over those meetings to find the available slots between them. 
    static async getMeetingSuggestion(req: IncomingMessage, res: ServerResponse) {
        const body: string = await MeetingService.getBody(req);
        const { date, participant1, participant2 } = JSON.parse(body);

        if (!date || !participant1 || !participant2) {
            MeetingService.sendResponse(res, 400, { error: 'Missing parameters!' });
            return;
        }

        if (!MeetingService.isValidDateFormat(date)) {
            MeetingService.sendResponse(res, 400, { error: 'Date should be in YYYY-MM-DD format' });
            return;
        }

        const filteredMeetings = MeetingService.meetings.filter(meeting =>
            meeting.startTime.toDateString() === new Date(date).toDateString() 
            &&
            (meeting.participants.includes(participant1) || meeting.participants.includes(participant2))
        );

        //propose meetings, without overlaping filteredMeetings
        const availableSlots = MeetingService.recommendTimeSlots(date, filteredMeetings)

        MeetingService.sendResponse(res, 200, availableSlots);
    }

    static removeDuplicateEmails(emails: string[]): string[] {
        const uniqueEmailsSet: Set<string> = new Set();
        emails.forEach(email => uniqueEmailsSet.add(email));

        return Array.from(uniqueEmailsSet);
    }

    static isValidDateFormat(date: string) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }

    static recommendTimeSlots(date: string, meetings: Meeting[]): Date[] {
        const availableSlots = [];

        const day = new Date(date);
        const existingStartTimes = meetings.map(meeting => meeting.startTime);

        // Assuming office hours are from 9 AM to 5 PM
        for (let i = 9; i <= 17; i++) {
            const slotStart = new Date(day);
            slotStart.setHours(i, 0, 0);

            // User haven't planned any time slots, we can recommend the next in office hours
            if (existingStartTimes === null) {
                availableSlots.push(slotStart);
                continue;
            }

            // Checking if hour is in existing start times
            if (!existingStartTimes.some(startTime => startTime.getHours() === slotStart.getHours())) {
                availableSlots.push(slotStart);
            }
        }
        return availableSlots;
    }

    //TODO move to HttpClient Service
    public static sendResponse(res: ServerResponse, statusCode: number, message: object) {
        res.statusCode = statusCode;
        res.end(JSON.stringify(message));
    }

    //TODO move to HttpClient Service
    public static getBody(request: IncomingMessage): Promise<string> {
        return new Promise((resolve) => {
            const bodyParts: Uint8Array[] = [];
            let body;
            request.on('data', (chunk) => {
                bodyParts.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(bodyParts).toString();
                resolve(body);
            });
        });
    }
}

export default MeetingService;
