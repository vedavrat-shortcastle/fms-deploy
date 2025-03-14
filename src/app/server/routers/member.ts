import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  publicProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { Role } from '@prisma/client';
import { PERMISSIONS } from '@/constants';
import { Prisma } from '@prisma/client';
import {
  createMemberSchema,
  signupMemberSchema,
  editMemberSchema,
  deleteMemberSchema,
} from '@/schemas/member.schema';
import { z } from 'zod';

export const memberRouter = router({
  // Create a new member
  createMember: permissionProtectedProcedure(PERMISSIONS.MEMBER_CREATE)
    .input(createMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.orgId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No organization context found',
          });
        }

        const hashedPassword = await hashPassword(input.password);
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email_organizationId: {
              email: input.email,
              organizationId: ctx.session.user.orgId,
            },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        const user = await ctx.db.user.create({
          data: {
            ...input,
            role: Role.MEMBER,
            password: hashedPassword,
            organizationId: ctx.session.user.orgId,
            countryCode: input.countryCode,
            permissions: {
              create: input.permissions.map((permission: string) => ({
                permission: { connect: { id: permission } },
              })),
            },
          },
        });

        return { ...user, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to create member',
          cause: error.message,
        });
      }
    }),
  // Get all members
  getMembers: permissionProtectedProcedure(PERMISSIONS.MEMBER_VIEW)
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit } = input;
        const offset = (page - 1) * limit;
        const where: Prisma.UserWhereInput = {
          role: Role.MEMBER,
          organizationId: ctx.session.user.orgId,
          isDisabled: false,
        };

        const members = await ctx.db.user.findMany({
          where,
          skip: offset,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            organization: true,
            club: true,
          },
        });

        const totalMembers = await ctx.db.user.count({ where });

        return {
          members,
          total: totalMembers,
          page,
          limit,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch members',
          cause: error.message,
        });
      }
    }),
  // Get a member by ID
  getMemberById: permissionProtectedProcedure(PERMISSIONS.MEMBER_VIEW)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const member = await ctx.db.user.findUnique({
          where: { id: input.id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            organization: true,
            club: true,
          },
        });

        if (!member) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Member not found',
          });
        }

        return member;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch member',
          cause: error.message,
        });
      }
    }),
  // Edit a member by ID
  editMemberById: permissionProtectedProcedure(PERMISSIONS.MEMBER_UPDATE)
    .input(editMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, data } = input;

        const member = await ctx.db.user.update({
          where: { id },
          data: {
            ...data,
            permissions: data.permissions
              ? {
                  set: [],
                  create: data.permissions.map((permission: string) => ({
                    permission: { connect: { id: permission } },
                  })),
                }
              : undefined,
          },
        });

        return { ...member, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to edit member',
          cause: error.message,
        });
      }
    }),
  // Delete a member by ID
  deleteMemberById: permissionProtectedProcedure(PERMISSIONS.MEMBER_DELETE)
    .input(deleteMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: { id: input.id },
          data: { isDisabled: true },
        });

        return { success: true };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to delete member',
          cause: error.message,
        });
      }
    }),
  // Signup a new member
  signup: publicProcedure
    .input(signupMemberSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const currentOrg = await ctx.db.organization.findFirst({
          where: { domain: input.domain },
          select: { id: true },
        });
        if (!currentOrg) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organization not found',
          });
        }
        const hashedPassword = await hashPassword(input.password);
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email_organizationId: {
              email: input.email,
              organizationId: currentOrg.id,
            },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        const user = await ctx.db.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName,
            gender: input.gender,
            phoneNumber: input.phoneNumber,
            countryCode: input.countryCode,
            role: Role.MEMBER,
          },
        });

        return { ...user, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to sign up member',
          cause: error.message,
        });
      }
    }),
});
