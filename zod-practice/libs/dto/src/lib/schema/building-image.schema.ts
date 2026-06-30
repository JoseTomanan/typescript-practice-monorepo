import { z } from 'zod';
import { imageSource } from '../enum/index.js';

export const buildingImageSchema = z.object({
  buildingImageId: z.string().optional(),
  buildingId: z.string(),
  bucketName: z.string().optional(),
  key: z.string().optional(),
  mimeType: z.string().optional(),
  url: z.string().optional(),
  source: imageSource.optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type BuildingImage = z.infer<typeof buildingImageSchema>;
