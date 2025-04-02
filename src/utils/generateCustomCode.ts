import { Prisma, PrismaClient, Role } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';

export async function generateCustomPlayerId(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  federationId: string
): Promise<string> {
  const federation = await db.federation.findFirst({
    where: { id: federationId },
    select: {
      shortCode: true,
    },
  });

  if (!federation) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Federation not found',
    });
  }

  const playerCount = await db.baseUser.count({
    where: {
      federationId,
      role: Role.PLAYER,
    },
  });

  const paddedCount = playerCount.toString().padStart(4, '0');

  return `${federation.shortCode}#${paddedCount}`;
}
