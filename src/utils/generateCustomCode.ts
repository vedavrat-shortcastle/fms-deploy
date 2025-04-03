import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';

export async function generateCustomPlayerId(
  db: PrismaClient,
  federationId: string
): Promise<string> {
  const federation = await db.federation.findFirst({
    where: { id: federationId },
    select: { shortCode: true },
  });

  if (!federation) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Federation not found',
    });
  }

  const timestamp = Date.now().toString().slice(-6); // Use last 6 digits of timestamp
  const randomSuffix = nanoid(4); // Generate a 4-character random suffix

  return `${federation.shortCode}-${timestamp}-${randomSuffix}`;
}

export async function generateBulkCustomPlayerIds(
  db: PrismaClient,
  federationId: string,
  count: number
): Promise<string[]> {
  const federation = await db.federation.findFirst({
    where: { id: federationId },
    select: { shortCode: true },
  });

  if (!federation) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Federation not found',
    });
  }

  const timestamp = Date.now().toString().slice(-6); // Use last 6 digits of timestamp
  const ids: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomSuffix = nanoid(4); // Generate a 4-character random suffix
    ids.push(`${federation.shortCode}-${timestamp}-${randomSuffix}`);
  }

  return ids;
}
