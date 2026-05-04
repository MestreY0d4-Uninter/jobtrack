import type { FastifyInstance, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';

import type { ApplicationRepository } from '../applications/application.repository.js';
import { isoDateStringSchema } from '../applications/application.schema.js';
import { buildDashboardSummary } from './dashboard.summary.js';

const summaryQuerySchema = z.object({
  today: isoDateStringSchema.optional(),
});

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

export function registerDashboardRoutes(
  app: FastifyInstance,
  applicationRepository: ApplicationRepository,
) {
  app.get('/dashboard/summary', async (request, reply) => {
    const parsed = summaryQuerySchema.safeParse(request.query);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const applications = await applicationRepository.findMany();
    const options = parsed.data.today === undefined ? {} : { today: parsed.data.today };
    const summary = buildDashboardSummary(applications, options);

    return reply.send(summary);
  });
}
