import { z } from 'zod';

/**
 * Zod enums for the Saxon schema.
 *
 * These mirror the arrays in `enum/enum.array.ts`, but are defined directly as
 * `z.enum([...])` so they (a) compile without the missing `*.enum.ts` source
 * files and (b) give us a static union type for free, e.g.
 *   type BuildingStatus = z.infer<typeof buildingStatus>  // "ACTIVE" | "SHELL" | ...
 *
 * The literal values below use the enum *member names*. If your real TS enums
 * map to different string values, change the literals here to match.
 */

export const buildingStatus = z.enum(['ACTIVE', 'SHELL', 'DELETED']);

export const buildingLeaseType = z.enum(['MANAGED', 'SERVICED', 'LEASED']);

export const buildingSource = z.enum(['VALVE', 'EXTERNAL']);

export const imageSource = z.enum(['USER_UPLOAD', 'EXTERNAL']);

export const buildingSpacePlacement = z.enum(['INTERIOR', 'EXTERIOR']);

export const opportunitySharedAmenity = z.enum([
  'EVENT_SPACE',
  'DISABLED_ACCESS',
  '_247_ACCESS',
  'MANNED_RECEPTION',
  'BIKE_STORAGE',
  'ROOF_TERRACE',
  'SHOWERS',
  'GYM',
  'BIKE_RACK',
  'PET_FRIENDLY',
  'PARKING',
]);

export const opportunityMustHave = z.enum([
  'PRIVATE_KITCHEN',
  'PRIVATE_MEETING_ROOM',
  'PRIVATE_BREAKOUT_SPACE',
]);

export const operatorFundingRound = z.enum([
  'PRE_SEED',
  'SEED',
  'SERIES_A',
  'SERIES_B',
  'UNKNOWN',
]);

export const operatorSectorType = z.enum([
  'GENERAL',
  'TECHNOLOGY',
  'CREATIVE',
  'PROFESSIONAL_SERVICES',
  'OTHER',
  'UNKNOWN',
]);

export const operatorGrowthProfile = z.enum([
  'STABLE',
  'MODERATE_EXPANSION',
  'HIGH_EXPANSION',
  'HYPER_EXPANSION',
  'UNKNOWN',
]);

// The Building schema also has an inline (non-shared) enum for report map status:
export const generateReportMapStatus = z.enum([
  'PENDING',
  'PROCESSING',
  'GENERATED',
  'MODIFIED',
  'FAILED',
]);
