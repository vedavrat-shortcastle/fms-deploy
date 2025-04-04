import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  protectedProcedure,
  router,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { PERMISSIONS } from '@/config/permissions';
import { z } from 'zod';
import { defaultFormConfigs } from '@/config/defaultFormConfigs';
import { FormType } from '@prisma/client';

export const configRouter = router({
  // Initialize federation form configs
  initializeFederationConfigs: permissionProtectedProcedure(
    PERMISSIONS.FED_ALL
  ).mutation(async ({ ctx }) => {
    try {
      const federationId = ctx.session.user.federationId;
      if (!federationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No federation context found',
        });
      }

      // Create form templates with default configs
      await ctx.db.$transaction(async (tx) => {
        for (const [formType, config] of Object.entries(defaultFormConfigs)) {
          await tx.formTemplate.create({
            data: {
              federationId,
              formType: formType as FormType,
              fields: {
                create: config.fields,
              },
            },
          });
        }
      });

      return {
        success: true,
        message: 'Form configurations initialized successfully',
      };
    } catch (error: any) {
      handleError(error, {
        message: 'Failed to initialize form configurations',
        cause: error.message,
      });
    }
  }),

  // Get form configuration
  getFormConfig: protectedProcedure
    .input(
      z.object({
        formType: z.enum([
          'PLAYER',
          'PARENT',
          'EVENT',
          'CLUB',
          'SUBSCRIPTION',
          'MEMBERSHIP',
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const federationId = ctx.session.user.federationId;

        const formConfig = await ctx.db.formTemplate.findUnique({
          where: {
            federationId_formType: {
              federationId: federationId!,
              formType: input.formType,
            },
          },
          include: {
            fields: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        });

        if (!formConfig) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form configuration not found',
          });
        }

        return formConfig;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch form configuration',
          cause: error.message,
        });
      }
    }),

  updateField: protectedProcedure
    .input(
      z.object({
        formType: z.enum([
          'PLAYER',
          'PARENT',
          'EVENT',
          'CLUB',
          'SUBSCRIPTION',
          'MEMBERSHIP',
        ]),
        fieldName: z.string().min(1, 'Field name is required'), // Changed from fieldId to fieldName
        field: z.object({
          displayName: z.string().min(1, 'Display name is required'),
          isHidden: z.boolean().default(false),
          isMandatory: z.boolean().default(false),
          isDisabled: z.boolean().default(false),
          defaultValue: z.string().nullable().optional(),
          placeholder: z.string().nullable().optional(),
          validations: z.unknown().nullable().optional(),
          order: z.number().default(0),
          isCustomField: z.boolean().default(true),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const federationId = ctx.session.user.federationId;

        // Step 1: Find the FormTemplate for the given formType and federation
        const formTemplate = await ctx.db.formTemplate.findUnique({
          where: {
            federationId_formType: {
              federationId: federationId!,
              formType: input.formType,
            },
          },
        });

        if (!formTemplate) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found for this type and federation',
          });
        }

        // Step 2: Find the existing FormField using fieldName
        const existingField = await ctx.db.formField.findFirst({
          where: {
            fieldName: input.fieldName,
            formTemplateId: formTemplate.id,
          },
        });

        if (!existingField) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Field with name "${input.fieldName}" not found in the specified form template`,
          });
        }
        // Step 3: Transform validations to ensure it's Prisma-compatible
        const validationsValue =
          input.field.validations === undefined ||
          input.field.validations === null
            ? input.field.validations
            : JSON.parse(JSON.stringify(input.field.validations)); // Ensure JSON-compatible

        // Step 3: Update the FormField using the composite key [formTemplateId, fieldName]
        const updatedField = await ctx.db.formField.update({
          where: {
            formTemplateId_fieldName: {
              formTemplateId: formTemplate.id,
              fieldName: input.fieldName,
            },
          },
          data: {
            displayName: input.field.displayName,
            isHidden: input.field.isHidden,
            isMandatory: input.field.isMandatory,
            isDisabled: input.field.isDisabled,
            defaultValue: input.field.defaultValue,
            placeholder: input.field.placeholder,
            validations: validationsValue,
            order: input.field.order,
            isCustomField: input.field.isCustomField,
          },
        });

        return updatedField;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to update form field',
          cause: error.message,
        });
      }
    }),
});
