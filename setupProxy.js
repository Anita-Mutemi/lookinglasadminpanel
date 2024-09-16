import { createProxyMiddleware as proxy } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    ['/', '/login', '/auth', '/v1', '/projects', '/me', '/v1/projects'],
    proxy({
      target: 'https://crmv2.alphaterminal.pro',
      changeOrigin: true,
    }),
  );
}
