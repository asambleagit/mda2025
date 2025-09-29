#!/usr/bin/env python3
"""
Custom HTTP server script to serve files with no-cache headers.
This helps prevent browser caching during debugging.
Run with: python server.py
"""

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.getcwd()  # Serves the current directory

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add no-cache headers to prevent browser caching
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Optional: Customize logging if needed
        super().log_message(format, *args)

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT} with no-cache headers")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
