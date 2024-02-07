import { IncomingMessage, ServerResponse } from 'http';
import sinon, { SinonSandbox } from 'sinon';
import MeetingService from '../src/meeting/meeting.service';
import { Meeting } from '../src/meeting/meeting.entity';

describe('MeetingService', () => {
    let sandbox: SinonSandbox;
    let req: IncomingMessage;
    let res: ServerResponse;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = sandbox.createStubInstance(IncomingMessage);
        res = sandbox.createStubInstance(ServerResponse);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getMeetings', () => {
        it('should return meetings data', () => {
            const meetings: Meeting[] = [
                new Meeting('Meeting 1', new Date('2024-02-07'), []),
                new Meeting('Meeting 2', new Date('2024-02-07'), [])
            ];

            // Create a new stub for MeetingService.sendResponse
            const sendResponseStub = sandbox.stub(MeetingService, 'sendResponse');

            // Call the method under test
            MeetingService.getMeetings(req, res);

            // Assertions
            expect(res.statusCode).toBe(200);
            const expected = sendResponseStub.calledOnceWith(res, 200, meetings);

            expect(expected).toBe(true);
        });
    });

    describe('addMeeting', () => {
        it('should handle invalid JSON', async () => {
            const invalidRequestBody = 'Invalid JSON';
            const sendResponseStub = sandbox.stub(MeetingService, 'sendResponse');
            sandbox.stub(MeetingService, 'getBody').rejects(new Error('Invalid JSON'));

            await MeetingService.addMeeting(req, res);

            expect(sendResponseStub.calledOnceWith(res, 400, { error: 'Invalid JSON' })).toBe(true);
            expect(MeetingService.meetings).toHaveLength(2); // Ensure no meeting was added
        });

        it('should handle missing parameters', async () => {
            const invalidRequest = {
                title: 'Missing Date'
            };
            const invalidRequestBody = JSON.stringify(invalidRequest);
            const sendResponseStub = sandbox.stub(MeetingService, 'sendResponse');
            sandbox.stub(MeetingService, 'getBody').resolves(invalidRequestBody);

            await MeetingService.addMeeting(req, res);

            expect(sendResponseStub.calledOnceWith(res, 400, { error: 'Missing parameters' })).toBe(true);
            expect(MeetingService.meetings).toHaveLength(2); // Ensure no meeting was added
        });

        it('should add a new meeting', async () => {
            const addMeetingRequest = {
                title: 'New Meeting',
                startTime: '2024-02-10',
                participants: []
            };
            const addMeetingRequestBody = JSON.stringify(addMeetingRequest);
            const sendResponseStub = sandbox.stub(MeetingService, 'sendResponse');
            sandbox.stub(MeetingService, 'getBody').resolves(addMeetingRequestBody);

            await MeetingService.addMeeting(req, res);

            expect(sendResponseStub.calledOnce).toBe(true);
            expect(sendResponseStub.calledWith(res, 201, sinon.match.instanceOf(Meeting))).toBe(true);
            expect(MeetingService.meetings).toHaveLength(3); // Ensure a new meeting was added
        });
    });
});
