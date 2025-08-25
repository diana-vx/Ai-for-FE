const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

const server = http.createServer((req, res) => {
    // Determine the file path from the request URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './email-template.html';
    }

    // Get the file extension to determine the content type
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // Page not found - we don't have a 404.html, so just send a simple message
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // Some other server error
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\\n');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
