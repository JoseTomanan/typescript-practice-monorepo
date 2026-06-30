import { z } from 'zod';
import {
  buildingLeaseType,
  buildingStatus,
  opportunitySharedAmenity,
  generateReportMapStatus,
} from '../enum/index.js';

// taken from zod-exercise-schema.ts
// redo if wrong ; the specs aren't very clear kasi :/
export const buildingSchema = z.object({
  buildingId: z.string().optional(),
  buildingName: z.string().optional(),
  buildingNameLowercase: z.string().optional(),
  operator: z.string().optional(),
  operatorId: z.string().optional(),
  leaseType: buildingLeaseType.optional(),
  address: z.string().optional(),
  addressLowercase: z.string().optional(),
  location: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  amenities: z.array(opportunitySharedAmenity)
    .default([]),
  availableFrom: z.string().optional(),
  numOfDesksFrom: z.number().optional(),
  numOfDesksTo: z.number().optional(),
  sizeFrom: z.number().optional(),
  sizeTo: z.number().optional(),
  numOfSpaces: z.number().optional(),
  transportation: z.array(
      z.record(z.unknown())
    ).default([]),
  brochureUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  overview: z.string().optional(),
  source: z.string().optional(),
  externalId: z.string().optional(),
  status: buildingStatus.optional(),
  calculatedPricePerFtFrom: z.number().optional(),
  calculatedPricePerFtTo: z.number().optional(),
  calculatedPricePerDeskFrom: z.number().optional(),
  calculatedPricePerDeskTo: z.number().optional(),
  calculatedPricePerMonthFrom: z.number().optional(),
  calculatedPricePerMonthTo: z.number().optional(),
  searchString: z.string().optional(),
  amenitiesString: z.string().optional(),
  numOfKitchens: z.number().optional(),
  numOfMeetingRooms: z.number().optional(),
  numOfBreakoutSpaces: z.number().optional(),
  floorplans: z.array(z.string()).optional(),
  preferredSpaces: z.array(z.record(z.unknown()))
    .default([]),
  thumbnailImageId: z.string().optional(),
  generateReportMapStatus: generateReportMapStatus.optional(),
  generatedReportMapBucketName: z.string().optional(),
  generatedReportMapS3Key: z.string().optional(),
  generatedReportMapMimeType: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export type Building = z.infer<typeof buildingSchema>;
