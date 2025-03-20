import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { S3Service } from '@/lib/s3service';

export const uploadRouter = router({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        uploadFolder: z.enum(['avatar', 'age-proof']),
      })
    )
    .mutation(async ({ input }) => {
      const s3Service = new S3Service();
      const key = `${input.uploadFolder}/${Date.now()}-${input.fileName}`;
      const url = await s3Service.generatePresignedUploadUrl(
        key,
        input.fileType
      );

      return {
        uploadUrl: url,
        key: key,
      };
    }),
});
