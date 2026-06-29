import { z } from 'zod';
import { operatorFundingRound, operatorSectorType, operatorGrowthProfile } from '../enum/index.js';
// TODO: review if import is correct? Why is it js?

export const operatorSchema = z.object({
  operatorId: z.string().optional(),
  name: z.string().optional(),
  searchString: z.string().optional(),
  leaseType: z.string().optional(),
  source: z.string().optional(),
  logoBucket: z.string().optional(),
  logoS3Key: z.string().optional(),
  logoMimeType: z.string().optional(),
  logoExtUrl: z.string().optional(),
  version: z.number().default(1),
  fundingRound: z.array(operatorFundingRound).optional(),
  sectorType: z.array(operatorSectorType).optional(),
  growthProfile: z.array(operatorGrowthProfile).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Operator = z.infer<typeof operatorSchema>;
