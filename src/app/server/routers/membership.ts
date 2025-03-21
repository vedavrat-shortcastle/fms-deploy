import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  protectedProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { PERMISSIONS } from '@/config/permissions';
import { z } from 'zod';
import { Prisma, PlanStatus } from '@prisma/client';
import {
  createPlanSchema,
  getPlanSchema,
  updatePlanSchema,
} from '@/schemas/Membership.schema';

export const membershipRouter = router({
  // Create membership plan
  createPlan: permissionProtectedProcedure(PERMISSIONS.PLAN_CREATE)
    .input(createPlanSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.federationId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        const plan = await ctx.db.membershipPlan.create({
          data: {
            ...input,
            federationId: ctx.session.user.federationId,
          },
        });

        return plan;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create membership plan',
          cause: error.message,
        });
      }
    }),

  // Get all plans for federation
  getPlans: protectedProcedure
    .input(getPlanSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, status = 'ACTIVE', searchQuery } = input;
        const offset = (page - 1) * limit;

        const where: Prisma.MembershipPlanWhereInput = {
          federationId: ctx.session.user.federationId,
          status: status,
          OR: searchQuery
            ? [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
              ]
            : undefined,
        };

        const [plans, total] = await ctx.db.$transaction([
          ctx.db.membershipPlan.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
              _count: {
                select: { subscriptions: true },
              },
            },
          }),
          ctx.db.membershipPlan.count({ where }),
        ]);

        return {
          plans,
          total,
          page,
          limit,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch membership plans',
          cause: error.message,
        });
      }
    }),

  // Get plan details with subscription stats
  getPlanById: permissionProtectedProcedure(PERMISSIONS.PLAN_VIEW)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const plan = await ctx.db.membershipPlan.findFirst({
          where: {
            id: input.id,
            federationId: ctx.session.user.federationId,
          },
          include: {
            _count: {
              select: { subscriptions: true },
            },
            subscriptions: {
              select: {
                status: true,
                createdAt: true,
                subscriber: {
                  select: {
                    id: true,
                    parent: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!plan) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Membership plan not found',
          });
        }

        return plan;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch plan details',
          cause: error.message,
        });
      }
    }),

  // Update plan
  updatePlan: permissionProtectedProcedure(PERMISSIONS.PLAN_UPDATE)
    .input(updatePlanSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        const plan = await ctx.db.membershipPlan.findFirst({
          where: {
            id,
            federationId: ctx.session.user.federationId,
          },
        });

        if (!plan) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Membership plan not found',
          });
        }

        const updatedPlan = await ctx.db.membershipPlan.update({
          where: { id },
          data: updateData,
        });

        return updatedPlan;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to update membership plan',
          cause: error.message,
        });
      }
    }),

  // Archive plan
  archivePlan: permissionProtectedProcedure(PERMISSIONS.PLAN_DELETE)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const plan = await ctx.db.membershipPlan.findFirst({
          where: {
            id: input.id,
            federationId: ctx.session.user.federationId,
          },
        });

        if (!plan) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Membership plan not found',
          });
        }

        const updatedPlan = await ctx.db.membershipPlan.update({
          where: { id: input.id },
          data: { status: PlanStatus.ARCHIVED },
        });

        return updatedPlan;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to archive membership plan',
          cause: error.message,
        });
      }
    }),
});
