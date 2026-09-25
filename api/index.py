import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.app import app as _app

class _StripApiPrefix:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            path = scope.get("path", "")
            if path.startswith("/api"):
                scope["path"] = path[4:] or "/"
                raw = scope.get("raw_path", b"")
                if raw.startswith(b"/api"):
                    scope["raw_path"] = raw[4:] or b"/"
        await self.inner(scope, receive, send)

app = _StripApiPrefix(_app)
