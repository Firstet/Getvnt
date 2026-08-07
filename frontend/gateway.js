const http = require('http');

const PORT = 3000;

const TARGETS = {
  API: { host: '127.0.0.1', port: 8000 },
  ADMIN: { host: '127.0.0.1', port: 3003 },
  WORKSPACE: { host: '127.0.0.1', port: 3002 },
  MARKETPLACE: { host: '127.0.0.1', port: 3001 },
};

function getTarget(url) {
  if (url.startsWith('/api') || url.startsWith('/sanctum')) {
    return TARGETS.API;
  }
  if (url.startsWith('/admin')) {
    return TARGETS.ADMIN;
  }
  if (url.startsWith('/workspace')) {
    return TARGETS.WORKSPACE;
  }
  return TARGETS.MARKETPLACE;
}

const server = http.createServer((req, res) => {
  let url = req.url;

  // Normalize /admin and /workspace redirect if missing trailing slash
  if (url === '/admin') {
    res.writeHead(302, { Location: '/admin/' });
    return res.end();
  }
  if (url === '/workspace') {
    res.writeHead(302, { Location: '/workspace/' });
    return res.end();
  }

  const target = getTarget(url);

  const proxyReq = http.request(
    {
      host: target.host,
      port: target.port,
      path: url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `localhost:${PORT}`,
        'x-forwarded-host': `localhost:${PORT}`,
        'x-forwarded-proto': 'http',
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/html' });
    res.end(`
      <div style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; background: #07090F; color: #FFF; min-height: 100vh;">
        <h2 style="color: #F87171;">502 Bad Gateway</h2>
        <p style="color: #9CA3AF;">Service on port ${target.port} is starting up or unavailable.</p>
        <p style="font-size: 13px; color: #6B7280;">Target URL: ${url}</p>
        <button onclick="location.reload()" style="background: #4F46E5; color: #FFF; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 16px;">
          Retry Connection
        </button>
      </div>
    `);
  });

  req.pipe(proxyReq, { end: true });
});

// Support WebSockets (HMR for Vite)
server.on('upgrade', (req, socket, head) => {
  const target = getTarget(req.url);
  const proxyReq = http.request({
    host: target.host,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  });

  proxyReq.on('error', () => {
    socket.destroy();
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\n` +
        Object.keys(proxyRes.headers)
          .map((key) => `${key}: ${proxyRes.headers[key]}`)
          .join('\r\n') +
        '\r\n\r\n'
    );
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Getvnt Unified Gateway Proxy live on PORT ${PORT}`);
  console.log(`------------------------------------------------------`);
  console.log(` ➔ Marketplace:  http://localhost:${PORT}/`);
  console.log(` ➔ Organizer OS: http://localhost:${PORT}/workspace/`);
  console.log(` ➔ Super Admin:   http://localhost:${PORT}/admin/`);
  console.log(` ➔ Laravel API:  http://localhost:${PORT}/api/`);
  console.log(`======================================================\n`);
});
