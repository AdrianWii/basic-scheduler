import { IncomingMessage, ServerResponse } from 'http';
import sinon, { SinonSandbox } from 'sinon';
import { User } from '../src/user/user.entity';
import UserService from '../src/user/user.service';

describe('UserService', () => {
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

    describe('getUsers', () => {
        it('should return users data', () => {
            const users: User[] = [
                new User('Adrian', 'Widlak', 'adrian.widlak@adrianwii.pl'),
            ];

            // Create a new stub for UserService.sendResponse
            const sendResponseStub = sandbox.stub(UserService, 'sendResponse');

            // Call the method under test
            UserService.getUsers(req, res);

            // Assertions
            expect(res.statusCode).toBe(200);
            const expected = sendResponseStub.calledOnceWith(res, 200, users);

            expect(expected).toBe(true);
        });
    });

    describe('addUser', () => {
        it('should handle invalid JSON', async () => {
            const sendResponseStub = sandbox.stub(UserService, 'sendResponse');
            sandbox.stub(UserService, 'getBody').rejects(new Error('Invalid JSON'));

            await UserService.addUser(req, res);

            expect(sendResponseStub.calledOnceWith(res, 400, { error: 'Invalid JSON' })).toBe(true);
            expect(UserService.users).toHaveLength(1); // Ensure no data was added
        });

        it('should handle missing parameters', async () => {
            const invalidRequest = {
                title: 'Missing Date'
            };
            const invalidRequestBody = JSON.stringify(invalidRequest);
            const sendResponseStub = sandbox.stub(UserService, 'sendResponse');
            sandbox.stub(UserService, 'getBody').resolves(invalidRequestBody);

            await UserService.addUser(req, res);

            expect(sendResponseStub.calledOnceWith(res, 400, { error: 'Missing parameters' })).toBe(true);
            expect(UserService.users).toHaveLength(1); // Ensure no data was added
        });

        it('should check if email is unique', async () => {
            const duplicatedEmailUserRequest = {
                name: 'John',
                surname: 'Snow',
                email: 'adrian.widlak@adrianwii.pl'
            };
            const duplicatedEmailUserRequestBody = JSON.stringify(duplicatedEmailUserRequest);
            const sendResponseStub = sandbox.stub(UserService, 'sendResponse');
            sandbox.stub(UserService, 'getBody').resolves(duplicatedEmailUserRequestBody);

            await UserService.addUser(req, res);

            expect(sendResponseStub.calledOnceWith(res, 400, { error: 'Email already exists' })).toBe(true);
            expect(UserService.users).toHaveLength(1); // Ensure no data was added
        });

        it('should add a new user', async () => {
            const addUserRequest = {
                name: 'John',
                surname: 'Snow',
                email: 'john.snow@adrianwii.pl'
            };
            const addUserRequestBody = JSON.stringify(addUserRequest);
            const sendResponseStub = sandbox.stub(UserService, 'sendResponse');
            sandbox.stub(UserService, 'getBody').resolves(addUserRequestBody);

            await UserService.addUser(req, res);

            expect(sendResponseStub.calledOnce).toBe(true);
            expect(sendResponseStub.calledWith(res, 201, sinon.match.instanceOf(User))).toBe(true);
            expect(UserService.users).toHaveLength(2); // Ensure a new data was added
        });
    });
});
