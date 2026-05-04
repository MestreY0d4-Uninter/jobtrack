import Fastify, { type FastifyServerOptions } from 'fastify';

import type { ApplicationRepository } from './modules/applications/application.repository.js';
import { registerApplicationRoutes } from './modules/applications/application.routes.js';
import { registerDashboardRoutes } from './modules/dashboard/dashboard.routes.js';

export type BuildAppDependencies = {
  applicationRepository?: ApplicationRepository;
};

export function buildApp(
  options: FastifyServerOptions = {},
  dependencies: BuildAppDependencies = {},
) {
  const app = Fastify(options);

  app.get('/health', async () => ({ status: 'ok' }));

  if (dependencies.applicationRepository !== undefined) {
    registerApplicationRoutes(app, dependencies.applicationRepository);
    registerDashboardRoutes(app, dependencies.applicationRepository);
  }

  return app;
}
