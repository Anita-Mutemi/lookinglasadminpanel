import { createProxyMiddleware as proxy } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    ['/', '/login', '/auth', '/v1', '/projects', '/me', '/v1/projects'],
    proxy({
      target: 'https://young-refuge-51933-4129d1214e9f.herokuapp.com',
      changeOrigin: true,
    }),
  );
}
