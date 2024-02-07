import http from 'http';
import UserService from './src/user/user.service';
import MeetingService from './src/meeting/meeting.service';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');

    switch (req.url) {
        //TODO add handlers
        case '/user':
            //TODO it should be moved to separate controller
            if (req.method === 'GET') {
                UserService.getUsers(req, res);
            }

            if (req.method === 'POST') {
                UserService.addUser(req, res).then(() => { });
            }
            break;
        case '/meeting':
            //TODO it should be moved to separate controller
            if (req.method === 'GET') {
                MeetingService.getMeetings(req, res);
            }

            if (req.method === 'POST') {
                MeetingService.addMeeting(req, res).then(() => { });
            }
            break;
        default:
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
