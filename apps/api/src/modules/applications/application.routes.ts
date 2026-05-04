import type { FastifyInstance, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';

import {
  applicationStatusSchema,
  createApplicationSchema,
  updateApplicationSchema,
  workModeSchema,
} from './application.schema.js';
import type { ApplicationFilters } from './application.filters.js';
import type { ApplicationRepository } from './application.repository.js';

const idParamsSchema = z.object({
  id: z.string().uuid(),
});

const listQuerySchema = z.object({
  status: applicationStatusSchema.optional(),
  workMode: workModeSchema.optional(),
  stack: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  q: z.string().trim().min(1).optional(),
});

const toApplicationFilters = (query: z.infer<typeof listQuerySchema>): ApplicationFilters => {
  const filters: ApplicationFilters = {};

  if (query.status !== undefined) {
    filters.status = query.status;
  }

  if (query.workMode !== undefined) {
    filters.workMode = query.workMode;
  }

  if (query.stack !== undefined) {
    filters.stack = query.stack;
  }

  const search = query.search ?? query.q;
  if (search !== undefined) {
    filters.search = search;
  }

  return filters;
};

const formatIssues = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

const sendValidationError = (reply: FastifyReply, error: ZodError) =>
  reply.status(400).send({
    error: 'validation_error',
    issues: formatIssues(error),
  });

export function registerApplicationRoutes(
  app: FastifyInstance,
  applicationRepository: ApplicationRepository,
) {
  app.post('/applications', async (request, reply) => {
    const parsed = createApplicationSchema.safeParse(request.body);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const application = await applicationRepository.create(parsed.data);

    return reply.status(201).send(application);
  });

  app.get('/applications', async (request, reply) => {
    const parsed = listQuerySchema.safeParse(request.query);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const applications = await applicationRepository.findMany(toApplicationFilters(parsed.data));

    return reply.send({ data: applications });
  });

  app.get('/applications/:id', async (request, reply) => {
    const parsed = idParamsSchema.safeParse(request.params);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const application = await applicationRepository.findById(parsed.data.id);

    if (application === null) {
      return reply.status(404).send({ error: 'not_found' });
    }

    return reply.send(application);
  });

  app.patch('/applications/:id', async (request, reply) => {
    const params = idParamsSchema.safeParse(request.params);

    if (!params.success) {
      return sendValidationError(reply, params.error);
    }

    const body = updateApplicationSchema.safeParse(request.body);

    if (!body.success) {
      return sendValidationError(reply, body.error);
    }

    const application = await applicationRepository.update(params.data.id, body.data);

    if (application === null) {
      return reply.status(404).send({ error: 'not_found' });
    }

    return reply.send(application);
  });

  app.delete('/applications/:id', async (request, reply) => {
    const parsed = idParamsSchema.safeParse(request.params);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const deleted = await applicationRepository.delete(parsed.data.id);

    if (!deleted) {
      return reply.status(404).send({ error: 'not_found' });
    }

    return reply.status(204).send();
  });
}
