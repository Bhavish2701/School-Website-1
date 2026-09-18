/**
 * Sri Vidya E.M High School - Clean URL Development Server (Node.js)
 * Clean URLs:
 *   - /management -> portal.html
 *   - /teacher    -> teacher-portal.html
 *   - /student    -> student-portal.html
 *   - /           -> index.html
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8080', 10);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  let pathname = parsed.pathname;
  let clean = pathname.replace(/\/+$/, '');

  if (clean === '/management' || clean === '/portal.html' || clean === '/management.html') {
    pathname = '/portal.html';
  } else if (clean === '/teacher' || clean === '/teacher-portal.html' || clean === '/teacher.html') {
    pathname = '/teacher-portal.html';
  } else if (clean === '/student' || clean === '/student-portal.html' || clean === '/student.html') {
    pathname = '/student-portal.html';
  } else if (clean === '/parent' || clean === '/parent-portal.html' || clean === '/parent.html') {
    pathname = '/parent-portal.html';
  } else if (clean === '' || clean === '/') {
    pathname = '/index.html';
  } else if (pathname.startsWith('/management/') || pathname.startsWith('/teacher/') || pathname.startsWith('/student/') || pathname.startsWith('/parent/')) {
    pathname = pathname.replace(/^\/(?:management|teacher|student|parent)/, '');
  }

  const filePath = path.join(ROOT, pathname);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Node Server running at http://localhost:${PORT}/`);
  console.log(`  Management: http://localhost:${PORT}/management`);
  console.log(`  Teacher:    http://localhost:${PORT}/teacher`);
  console.log(`  Student:    http://localhost:${PORT}/student`);
});
