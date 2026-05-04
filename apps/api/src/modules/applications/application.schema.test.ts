import { describe, expect, it } from 'vitest';

import { createApplicationSchema, updateApplicationSchema } from './application.schema.js';

describe('createApplicationSchema', () => {
  it('accepts a valid company and role with safe defaults', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Tech Curitiba',
      role: 'Estágio em Desenvolvimento Web',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        company: 'Tech Curitiba',
        role: 'Estágio em Desenvolvimento Web',
        status: 'interested',
        workMode: 'unknown',
        stacks: [],
      });
    }
  });

  it('rejects an empty company', () => {
    const result = createApplicationSchema.safeParse({
      company: ' ',
      role: 'Estágio em Desenvolvimento Web',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty role', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Tech Curitiba',
      role: ' ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid job URL', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Tech Curitiba',
      role: 'Estágio em Desenvolvimento Web',
      jobUrl: 'not-a-url',
    });

    expect(result.success).toBe(false);
  });

  it('rejects notes above 2000 characters', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Tech Curitiba',
      role: 'Estágio em Desenvolvimento Web',
      notes: 'a'.repeat(2001),
    });

    expect(result.success).toBe(false);
  });
});

describe('updateApplicationSchema', () => {
  it('accepts partial updates without applying create defaults', () => {
    const result = updateApplicationSchema.safeParse({
      status: 'interview',
      notes: 'Entrevista técnica marcada.',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        status: 'interview',
        notes: 'Entrevista técnica marcada.',
      });
    }
  });

  it('converts empty clearable fields to null', () => {
    const result = updateApplicationSchema.safeParse({
      notes: '',
      nextActionDate: '',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        notes: null,
        nextActionDate: null,
      });
    }
  });

  it('rejects empty update payloads', () => {
    const result = updateApplicationSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
