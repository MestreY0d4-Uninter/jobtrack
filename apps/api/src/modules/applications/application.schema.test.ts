import { describe, expect, it } from 'vitest';

import { createApplicationSchema, updateApplicationSchema } from './application.schema.js';

describe('createApplicationSchema', () => {
  it('accepts a valid company and role with safe defaults', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Tech Curitiba',
      role: 'Desenvolvedor Web',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        company: 'Tech Curitiba',
        role: 'Desenvolvedor Web',
        status: 'interested',
        workMode: 'unknown',
        stacks: [],
      });
    }
  });

  it('rejects an empty company', () => {
    const result = createApplicationSchema.safeParse({
      company: ' ',
      role: 'Desenvolvedor Web',
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
      role: 'Desenvolvedor Web',
      jobUrl: 'not-a-url',
    });

    expect(result.success).toBe(false);
  });

  it('rejects non-http job URL protocols', () => {
    for (const jobUrl of ['javascript:alert(1)', 'data:text/html,<h1>x</h1>', 'ftp://example.com/vaga']) {
      const result = createApplicationSchema.safeParse({
        company: 'Tech Curitiba',
        role: 'Desenvolvedor Web',
        jobUrl,
      });

      expect(result.success).toBe(false);
    }
  });

  it('accepts http and https job URLs', () => {
    for (const jobUrl of ['http://example.com/vaga', 'https://example.com/vaga']) {
      const result = createApplicationSchema.safeParse({
        company: 'Tech Curitiba',
        role: 'Desenvolvedor Web',
        jobUrl,
      });

      expect(result.success).toBe(true);
    }
  });

  it('rejects non-http job URL protocols on update', () => {
    const result = updateApplicationSchema.safeParse({
      jobUrl: 'javascript:alert(1)',
    });

    expect(result.success).toBe(false);
  });

  it('rejects notes above 2000 characters', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Tech Curitiba',
      role: 'Desenvolvedor Web',
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
