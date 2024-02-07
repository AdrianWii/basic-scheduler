import { IncomingMessage, ServerResponse } from 'http';
import { Meeting } from './meeting.entity';

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
            const uniqueParticipants = MeetingService.removeDuplicateEmails(participants);

            if (!title || !startTime) {
                MeetingService.sendResponse(res, 400, { error: 'Missing parameters' });
                return;
            }

            const newMeeting = new Meeting(title, new Date(startTime), uniqueParticipants);
            this.meetings.push(newMeeting);
            MeetingService.sendResponse(res, 201, newMeeting);
            return;
        } catch (error) {
            MeetingService.sendResponse(res, 400, { error: 'Invalid JSON' });
            return;
        }
    }

     static removeDuplicateEmails(emails: string[]): string[] {
        const uniqueEmailsSet: Set<string> = new Set();
        emails.forEach(email => uniqueEmailsSet.add(email));

        return Array.from(uniqueEmailsSet);
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
