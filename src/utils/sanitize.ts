export const sanitizeFields = (fields: any[]) =>
  fields.map((field) => ({
    ...field,
    defaultValue: field.defaultValue ?? undefined,
    placeholder: field.placeholder ?? undefined,
    validations:
      typeof field.validations === 'object' && !Array.isArray(field.validations)
        ? field.validations
        : undefined,
  }));
