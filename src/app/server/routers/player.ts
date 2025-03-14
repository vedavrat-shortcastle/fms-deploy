import { TRPCError } from '@trpc/server';
import {
  permissionProtectedProcedure,
  router,
  publicProcedure,
} from '@/app/server/trpc';
import { handleError } from '@/utils/errorHandler';
import { hashPassword } from '@/utils/encoder';
import { Role } from '@prisma/client';
import { PERMISSIONS, roleMap } from '@/config/permissions';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  createPlayerSchema,
  deletePlayerSchema,
  editPlayerSchema,
  signupPlayerSchema,
} from '@/schemas/Player.schema';

export const playerRouter = router({
  // Create a new player
  createPlayer: permissionProtectedProcedure(PERMISSIONS.PLAYER_CREATE)
    .input(createPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.orgId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No federation context found',
          });
        }

        const hashedPassword = await hashPassword(input.password);
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email_federationId: {
              email: input.email,
              federationId: ctx.session.user.orgId,
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
            role: Role.PLAYER,
            password: hashedPassword,
            federationId: ctx.session.user.orgId,
            countryCode: input.countryCode,
            postalCode: '',
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
          message: 'Failed to create player',
          cause: error.message,
        });
      }
    }),
  // Get all players
  getMlayers: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
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
          role: Role.PLAYER,
          federationId: ctx.session.user.orgId,
          isDisabled: false,
        };

        const players = await ctx.db.user.findMany({
          where,
          skip: offset,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            federation: true,
            club: true,
          },
        });

        const totalPlayers = await ctx.db.user.count({ where });

        return {
          players,
          total: totalPlayers,
          page,
          limit,
        };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch players',
          cause: error.message,
        });
      }
    }),
  // Get a player by ID
  getPlayerById: permissionProtectedProcedure(PERMISSIONS.PLAYER_VIEW)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const player = await ctx.db.user.findUnique({
          where: { id: input.id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            federation: true,
            club: true,
          },
        });

        if (!player) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Player not found',
          });
        }

        return player;
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to fetch player',
          cause: error.message,
        });
      }
    }),
  // Edit a player by ID
  editPlayerById: permissionProtectedProcedure(PERMISSIONS.PLAYER_UPDATE)
    .input(editPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;

        const player = await ctx.db.user.update({
          where: { id },
          data: data,
        });

        return { ...player, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to edit player',
          cause: error.message,
        });
      }
    }),
  // Delete a player by ID
  deletePlayerById: permissionProtectedProcedure(PERMISSIONS.PLAYER_DELETE)
    .input(deletePlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: { id: input.id },
          data: { isDisabled: true },
        });

        return { success: true };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to delete player',
          cause: error.message,
        });
      }
    }),
  // Signup a new player
  signup: publicProcedure
    .input(signupPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const currentOrg = await ctx.db.federation.findFirst({
          where: { domain: input.domain },
          select: { id: true },
        });
        if (!currentOrg) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Federation not found',
          });
        }
        const hashedPassword = await hashPassword(input.password);
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email_federationId: {
              email: input.email,
              federationId: currentOrg.id,
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
            role: Role.PLAYER,
            birthDate: '',
            streetAddress: '',
            country: '',
            state: '',
            city: '',
            postalCode: '',
            permissions: {
              create: roleMap[Role.PLAYER].map((permission) => ({
                permission: { connect: { code: permission } },
              })),
            },
          },
        });

        return { ...user, password: undefined };
      } catch (error: any) {
        handleError(error, {
          message: 'Failed to sign up player',
          cause: error.message,
        });
      }
    }),
});
