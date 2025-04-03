import { publicProcedure, router } from '@/app/server/trpc';
import { roleMap } from '@/config/permissions';
import { clubOnboardingSchema } from '@/schemas/Club.schema';
import { hashPassword } from '@/utils/encoder';
import { handleError } from '@/utils/errorHandler';
import { ProfileType, Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const clubRouter = router({
  clubOnboarding: publicProcedure
    .input(clubOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const federation = await ctx.db.federation.findFirst({
        where: {
          domain: input.domain,
        },
        select: {
          id: true,
        },
      });
      if (!federation) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Federation ID is required',
        });
      }

      const baseUser = {
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
      };

      const club = {
        name: input.name,
        streetAddress: input.streetAddress,
        streetAddress2: input.streetAddress2,
        country: input.country,
        state: input.state,
        city: input.city,
        postalCode: input.postalCode,
        federationId: federation.id,
      };

      try {
        const existingClub = await ctx.db.club.findUnique({
          where: {
            name_federationId: {
              name: input.name,
              federationId: federation.id,
            },
          },
        });

        if (existingClub) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Federation with this domain already exists',
          });
        }
        const hashedPassword = await hashPassword(baseUser.password);
        // Wrap all database operations in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const createdClub = await tx.club.create({
            data: club,
            select: {
              id: true,
            },
          });
          const newBaseUser = await tx.baseUser.create({
            data: {
              ...baseUser,
              password: hashedPassword,
              role: Role.CLUB_MANAGER,
              federation: {
                connect: { id: federation.id },
              },
            },
          });

          const newClubManager = await tx.clubManager.create({
            data: {
              clubId: createdClub.id,
              phoneNumber: input.phoneNumber,
            },
          });

          const clubManagerPermissions = await tx.permission.findMany({
            where: {
              code: {
                in: roleMap[Role.CLUB_MANAGER],
              },
            },
            select: {
              id: true,
            },
          });

          const newUserProfile = await tx.userProfile.create({
            data: {
              baseUser: {
                connect: { id: newBaseUser.id },
              },
              profileType: ProfileType.CLUB_MANAGER,
              profileId: newClubManager.id,
            },
          });

          await tx.userPermission.createMany({
            data: clubManagerPermissions.map((permission) => ({
              permissionId: permission.id,
              userId: newUserProfile.id,
            })),
          });

          return {
            club: createdClub,
            userProfile: newUserProfile,
          };
        });

        return result;
      } catch (error: any) {
        console.log('error', error);
        handleError(error, {
          message: 'Failed to create club',
          cause: error.message ?? 'No error message',
        });
      }
    }),
});
