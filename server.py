"""
Sri Vidya E.M High School - Local Development Server
Supports clean URLs:
  - http://localhost:8080/management  -> Management Portal (Principal / VP)
  - http://localhost:8080/teacher     -> Teacher Portal (Ms. Anjali)
  - http://localhost:8080/student     -> Student Portal (Rahul)
  - http://localhost:8080/            -> Main Public Website
"""
import http.server
import socketserver
import os
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanURLRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        clean_path = path.rstrip('/')

        # Clean routing for management, teacher, student, and parent
        if clean_path in ('/management', '/portal.html', '/management.html'):
            self.path = '/portal.html'
        elif clean_path in ('/teacher', '/teacher-portal.html', '/teacher.html'):
            self.path = '/teacher-portal.html'
        elif clean_path in ('/student', '/student-portal.html', '/student.html'):
            self.path = '/student-portal.html'
        elif clean_path in ('/parent', '/parent-portal.html', '/parent.html'):
            self.path = '/parent-portal.html'
        elif clean_path in ('', '/'):
            self.path = '/index.html'
        elif path.startswith(('/management/', '/teacher/', '/student/', '/parent/')):
            sub = path.split('/', 2)[-1]
            self.path = '/' + sub

        if parsed.query:
            self.path += '?' + parsed.query

        return super().do_GET()

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    print(f"Starting Sri Vidya School Server on http://localhost:{PORT}")
    print(f"  Management Portal: http://localhost:{PORT}/management")
    print(f"  Teacher Portal:    http://localhost:{PORT}/teacher")
    print(f"  Student Portal:    http://localhost:{PORT}/student")
    print(f"  Parent Portal:     http://localhost:{PORT}/parent")
    print(f"  Public Website:    http://localhost:{PORT}/")
    try:
        with ThreadingTCPServer(("", PORT), CleanURLRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
