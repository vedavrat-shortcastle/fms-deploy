import { SupportedLanguages } from '@prisma/client';

export const getDirection = (language: SupportedLanguages) =>
  [SupportedLanguages.ar.toString()].includes(language) ? 'rtl' : 'ltr';
