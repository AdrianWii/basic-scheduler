import { IncomingMessage, ServerResponse } from 'http';
import { User } from './user.entity';

class UserService {
    static users: User[] = [
        new User('Adrian', 'Widlak', 'adrian.widlak@adrianwii.pl'),
    ];

    static getUsers(req: IncomingMessage, res: ServerResponse) {
        UserService.sendResponse(res, 200, UserService.users);
    }

    static async addUser(req: IncomingMessage, res: ServerResponse) {
        try {
            const body: string = await UserService.getBody(req);
            const { name, surname, email } = JSON.parse(body);

            if (!name || !surname || !email) {
                UserService.sendResponse(res, 400, { error: 'Missing parameters' });
                return;
            }

            const user = new User(name, surname, email);
            this.users.push(user);
            UserService.sendResponse(res, 201, user);
            return;
        } catch (error) {
            UserService.sendResponse(res, 400, { error: 'Invalid JSON' });
            return;
        }
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

export default UserService;
