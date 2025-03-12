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
import {
  createMemberSchema,
  signupMemberSchema,
} from '@/schemas/member.schema';

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
  getMembers: permissionProtectedProcedure(PERMISSIONS.MEMBER_VIEW).query(
    async ({ ctx }) => {
      try {
        const where = {
          role: Role.MEMBER,
          organizationId: ctx.session.user.orgId,
        };

        const members = await ctx.db.user.findMany({
          where,
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

        return members;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch members',
          cause: error.message,
        });
      }
    }
  ),
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
