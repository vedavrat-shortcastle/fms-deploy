import { TRPCError } from '@trpc/server';
import { permissionProtectedProcedure, router } from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { PERMISSIONS } from '@/config/permissions';
import { z } from 'zod';
import { defaultFormConfigs } from '@/config/defaultFormConfigs';
import { FormType } from '@prisma/client';

// Validation schemas
// const formFieldSchema = z.object({
//   fieldName: z.string(),
//   displayName: z.string(),
//   fieldType: z.enum([
//     'TEXT',
//     'NUMBER',
//     'EMAIL',
//     'PHONE',
//     'DATE',
//     'SELECT',
//     'MULTISELECT',
//     'CHECKBOX',
//     'RADIO',
//     'TEXTAREA',
//     'FILE',
//   ]),
//   isHidden: z.boolean().optional(),
//   isMandatory: z.boolean().optional(),
//   isDisabled: z.boolean().optional(),
//   defaultValue: z.string().optional(),
//   placeholder: z.string().optional(),
//   validations: z.any().optional(),
//   order: z.number(),
//   isCustomField: z.boolean().optional(),
// });

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
  getFormConfig: permissionProtectedProcedure(PERMISSIONS.FED_ALL)
    .input(
      z.object({
        formType: z.enum(['PLAYER', 'PARENT', 'EVENT', 'CLUB', 'SUBSCRIPTION']),
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

  // Update form configuration
  // updateFormConfig: permissionProtectedProcedure(PERMISSIONS.FED_ALL)
  //   .input(
  //     z.object({
  //       formType: z.enum(['PLAYER', 'PARENT', 'EVENT', 'CLUB', 'SUBSCRIPTION']),
  //       fields: z.array(formFieldSchema),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const federationId = ctx.session.user.federationId;

  //       await ctx.db.$transaction(async (tx) => {
  //         // Get existing template
  //         const template = await tx.formTemplate.findUnique({
  //           where: {
  //             federationId_formType: {
  //               federationId: federationId!,
  //               formType: input.formType,
  //             },
  //           },
  //           include: {
  //             fields: true,
  //           },
  //         });

  //         if (!template) {
  //           throw new TRPCError({
  //             code: 'NOT_FOUND',
  //             message: 'Form template not found',
  //           });
  //         }

  //         // Delete existing fields
  //         await tx.formField.deleteMany({
  //           where: {
  //             formTemplateId: template.id,
  //           },
  //         });

  //         // Create new fields
  //         await tx.formField.createMany({
  //           data: input.fields.map((field) => ({
  //             ...field,
  //             formTemplateId: template.id,
  //           })),
  //         });
  //       });

  //       return {
  //         success: true,
  //         message: 'Form configuration updated successfully',
  //       };
  //     } catch (error: any) {
  //       handleError(error, {
  //         message: 'Failed to update form configuration',
  //         cause: error.message,
  //       });
  //     }
  //   }),

  updateFormConfig: permissionProtectedProcedure(PERMISSIONS.FED_ALL)
    .input(
      z.object({
        formType: z.enum(['PLAYER', 'PARENT', 'EVENT', 'CLUB', 'SUBSCRIPTION']),
        fields: z.array(
          z.object({
            id: z.string(), // Ensure field ID is provided
            isMandatory: z.boolean(),
            isHidden: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const federationId = ctx.session.user.federationId;

        await ctx.db.$transaction(async (tx) => {
          // Get existing template with fields
          const template = await tx.formTemplate.findUnique({
            where: {
              federationId_formType: {
                federationId: federationId!,
                formType: input.formType,
              },
            },
            include: {
              fields: true,
            },
          });

          if (!template) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Form template not found',
            });
          }

          // Iterate through the provided fields and update only `isMandatory` and `isHidden`
          for (const field of input.fields) {
            await tx.formField.update({
              where: {
                id: field.id, // Match field by its ID
                formTemplateId: template.id, // Ensure it belongs to the correct form
              },
              data: {
                isMandatory: field.isMandatory,
                isHidden: field.isHidden,
              },
            });
          }
        });

        return {
          success: true,
          message: 'Form configuration updated successfully',
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to update form configuration',
          cause: error.message,
        });
      }
    }),
});
