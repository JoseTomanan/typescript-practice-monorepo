import { z } from 'zod';
import { imageSource } from '../enum/index.js';

export const spaceImageSchema = z.object({
  spaceImageId: z.string().optional(),
  buildingSpaceId: z.string(),
  buildingId: z.string().optional(),
  bucketName: z.string().optional(),
  key: z.string().optional(),
  mimeType: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
  source: imageSource.optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type SpaceImage = z.infer<typeof spaceImageSchema>;
