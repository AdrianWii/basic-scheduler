import http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');

    switch (req.url) {
        //TODO add handlers
        case '/user':
            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Ok' }));

            break;
        default:
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
