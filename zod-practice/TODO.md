# Zod Exercise: Schema Modelling

## Project Context

Saxon is a marketplace for flexible office space, similar to Airbnb but for coworking. Operators (e.g. WeWork, IWG) list Buildings on the platform. Each Building contains one or more Spaces that tenants can search and enquire on. Users browse listings filtered by price, size, lease type, and amenities. Images are stored separately per building and per space.

## Overview

This exercise uses a real DynamoDB single-table schema from that platform. Your task is to model each entity using Zod, covering field types, enums, required/optional fields, and nested objects/arrays.

---

## Entity Reference

### User

A platform user with either `USER` or `ADMIN` role. `email` and `userRole` are required. Has optional name fields and a `data` object containing country.

### EmailTemplate

Stores email templates. Contains a `data` object with `htmlData` and `textData` variants.

### Operator

A coworking space operator/brand (e.g. WeWork). Has branding (logo fields), and arrays for `fundingRound`, `sectorType`, and `growthProfile` — each constrained to specific enum values.

### Building

A physical location managed by an Operator (linked via `operatorId`). Has address, coordinates, lease type, amenities, and availability. The `calculatedPrice*` fields are aggregates derived from its spaces. `status` is an enum.

### BuildingImage

Images attached to a Building (linked via `buildingId`, required). Has S3 storage fields (`bucketName`, `key`, `mimeType`) plus a `url` and `source` enum.

### BuildingSpace

An individual lettable space within a Building (linked via `buildingId`, required). Has its own raw pricing (`pcm`, `pricePerFt`, `pricePerDesk`) and derived/calculated pricing fields. `placement` and `source` are enums. `amenities` is a constrained string array.

### SpaceImage

Images attached to a BuildingSpace (linked via `buildingSpaceId`, required). Mirrors `BuildingImage` but scoped to a space. Also carries a redundant `buildingId`.

---

## Entity Relationships

```none
Operator (1) ──────────── (many) Building
Building (1) ──────────── (many) BuildingSpace
Building (1) ──────────── (many) BuildingImage
BuildingSpace (1) ──────── (many) SpaceImage
```

`User` and `EmailTemplate` are standalone with no foreign keys into the building hierarchy.

---

## Source: `zod-exercise-schema.ts`

```typescript
import { EnumArray } from '@dto';

export const Schema = {
    version: '0.0.1',
    models: {
        User: {
            userRole: {
                type: String,
                enum: ['USER', 'ADMIN'],
                required: true,
            },
            userId: { type: String, generate: 'ulid' },
            email: { type: String, required: true },
            firstName: { type: String },
            lastName: { type: String },
            data: {
                type: Object,
                default: {},
                schema: {
                    country: { type: String },
                },
            },
        },
        EmailTemplate: {
            emailTemplateId: { type: String, generate: 'ulid' },
            subject: { type: String },
            data: {
                type: Object,
                default: {},
                schema: {
                    htmlData: { type: String },
                    textData: { type: String }
                },
            }
        },
        Building: {
            buildingId: { type: String, generate: 'ulid' },
            buildingName: { type: String },
            buildingNameLowercase: { type: String },
            operator: { type: String },
            operatorId: { type: String },
            leaseType: { type: String, enum: EnumArray.BUILDING_LEASE_TYPE },
            address: { type: String },
            addressLowercase: { type: String },
            location: { type: String },
            lat: { type: Number },
            long: { type: Number },
            amenities: {
                type: Array,
                items: {
                    type: String,
                    default: [],
                    enum: EnumArray.OPPORTUNITY_SHARED_AMENITY,
                }
            },
            availableFrom: { type: String },
            numOfDesksFrom: { type: Number },
            numOfDesksTo: { type: Number },
            sizeFrom: { type: Number },
            sizeTo: { type: Number },
            numOfSpaces: { type: Number },
            transportation: {
                type: Array,
                default: [],
                items: {
                    type: Object,
                    default: {}
                }
            },
            brochureUrl: { type: String },
            websiteUrl: { type: String },
            overview: { type: String },
            source: { type: String },
            externalId: { type: String },
            status: { type: String, enum: EnumArray.BUILDING_STATUS },
            calculatedPricePerFtFrom: { type: Number },
            calculatedPricePerFtTo: { type: Number },
            calculatedPricePerDeskFrom: { type: Number },
            calculatedPricePerDeskTo: { type: Number },
            calculatedPricePerMonthFrom: { type: Number },
            calculatedPricePerMonthTo: { type: Number },
            searchString: { type: String },
            amenitiesString: { type: String },
            numOfKitchens: { type: Number },
            numOfMeetingRooms: { type: Number },
            numOfBreakoutSpaces: { type: Number },
            floorplans: { type: Array, items: { type: String } },
            preferredSpaces: {
                type: Array,
                default: [],
                items: {
                    type: Object,
                }
            },
            thumbnailImageId: { type: String },
            generateReportMapStatus: { type: String, enum: ['PENDING', 'PROCESSING', 'GENERATED', 'MODIFIED', 'FAILED'] },
            generatedReportMapBucketName: { type: String },
            generatedReportMapS3Key: { type: String },
            generatedReportMapMimeType: { type: String },
            createdBy: { type: String },
            updatedBy: { type: String },
            created: { type: String },
            updated: { type: String },
        },
        BuildingImage: {
            buildingImageId: { type: String, generate: 'ulid' },
            buildingId: { type: String, required: true },
            bucketName: { type: String },
            key: { type: String },
            mimeType: { type: String },
            url: { type: String },
            source: { type: String, enum: EnumArray.IMAGE_SOURCE },
            createdBy: { type: String },
            updatedBy: { type: String },
        },
        BuildingSpace: {
            buildingSpaceId: { type: String, generate: 'ulid' },
            buildingId: { type: String, required: true },
            buildingName: { type: String },
            spaceNumber: { type: String },  // used for ordering the spaces
            name: { type: String },
            availability: { type: String },
            availableFrom: { type: String },
            termLength: { type: Number },
            placement: {
                type: String,
                enum: EnumArray.BUILDING_SPACE_PLACEMENT
            }, // Interior or Exterior
            floor: { type: String },
            floorplans: { type: Array, items: { type: String } },
            pcm: { type: Number },
            calculatedPricePerMonth: { type: Number },
            sqft: { type: Number },
            pricePerFt: { type: Number },
            calculatedPricePerFt: { type: Number },
            numOfDesks: { type: Number },
            pricePerDesk: { type: Number },
            calculatedPricePerDesk: { type: Number },
            description: { type: String },
            amenities: {
                type: Array,
                items: {
                    type: String,
                    default: [],
                    enum: EnumArray.OPPORTUNITY_MUST_HAVES,
                }
            },
            source: { type: String, enum: EnumArray.BUILDING_SOURCE },
            leaseType: { type: String },
            externalId: { type: String },
            platformId: { type: String }, // For future  only, ex. Valve database id
            spaceLocation: { type: String },
            operatorId: { type: String },
            operator: { type: String },
            address: { type: String },
            lat: { type: Number },
            long: { type: Number },
            amenitiesString: { type: String },
            numOfKitchens: { type: Number },
            numOfMeetingRooms: { type: Number },
            numOfBreakoutSpaces: { type: Number },
            thumbnailImageId: { type: String },
            createdBy: { type: String },
            updatedBy: { type: String },
            created: { type: String },
            updated: { type: String },
        },
        SpaceImage: {
            spaceImageId: { type: String, generate: 'ulid' },
            buildingSpaceId: { type: String, required: true },
            buildingId: { type: String },
            bucketName: { type: String },
            key: { type: String },
            mimeType: { type: String },
            url: { type: String },
            type: { type: String },
            source: { type: String, enum: EnumArray.IMAGE_SOURCE },
            createdBy: { type: String },
            updatedBy: { type: String },
        },
        Operator: {
            operatorId: { type: String, generate: 'ulid' },
            name: { type: String },
            searchString: { type: String },
            leaseType: { type: String },
            source: { type: String },
            logoBucket: { type: String },
            logoS3Key: { type: String },
            logoMimeType: { type: String },
            logoExtUrl: { type: String },
            version: { type: Number, default: 1 },
            fundingRound: {
                type: Array,
                items: {
                    type: String,
                    enum: EnumArray.OPERATOR_FUNDING_ROUND
                },
            },
            sectorType: {
                type: Array,
                items: {
                    type: String,
                    enum: EnumArray.OPERATOR_SECTOR_TYPE,
                }
            },
            growthProfile: {
                type: Array,
                items: {
                    type: String,
                    enum: EnumArray.OPERATOR_GROWTH_PROFILE,
                }
            },
            createdBy: { type: String },
            updatedBy: { type: String },
        },
    } as const,
    params: {
        isoDates: true,
        timestamps: true,
    },
};
```

---

## Source: `libs/dto/src/lib/enum/enum.array.ts`

```typescript
import { BuildingAliasType, BuildingCostUnit, BuildingLeaseType, BuildingSource, BuildingStatus, OperatorFundingRound, OperatorGrowthProfile, OperatorSectorType, ValveAllowedPanelTitles } from './building.enum';
import { ImageSource } from './image.enum';
import { BuildingSpaceAvailability, BuildingSpacePlacement, OpportunityBudgetUnit, OpportunityFilterFieldOption, OpportunityLeaseType, OpportunityMustHave, OpportunitySharedAmenity, OpportunityStatus } from './opportunity.enum';
import { LongListStatus } from './report.enum';

export class EnumArray {

    static BUILDING_STATUS = [
        BuildingStatus.ACTIVE,
        BuildingStatus.SHELL,
        BuildingStatus.DELETED,
    ];

    static OPPORTUNITY_STATUS = [
        OpportunityStatus.ACTIVE,
        OpportunityStatus.COLD,
        OpportunityStatus.LOST,
        OpportunityStatus.DELETED,
    ];

    static OPPORTUNITY_LEASE_TYPE = [
        OpportunityLeaseType.SERVICED,
        OpportunityLeaseType.MANAGED,
        OpportunityLeaseType.LEASED,
    ];

    static OPPORTUNITY_BUDGET_UNIT = [
        OpportunityBudgetUnit.PCM,
        OpportunityBudgetUnit.FT,
    ];

    static OPPORTUNITY_MUST_HAVES = [
        OpportunityMustHave.PRIVATE_KITCHEN,
        OpportunityMustHave.PRIVATE_MEETING_ROOM,
        OpportunityMustHave.PRIVATE_BREAKOUT_SPACE,
    ];

    static OPPORTUNITY_SHARED_AMENITY = [
        OpportunitySharedAmenity.EVENT_SPACE,
        OpportunitySharedAmenity.DISABLED_ACCESS,
        OpportunitySharedAmenity._247_ACCESS,
        OpportunitySharedAmenity.MANNED_RECEPTION,
        OpportunitySharedAmenity.BIKE_STORAGE,
        OpportunitySharedAmenity.ROOF_TERRACE,
        OpportunitySharedAmenity.SHOWERS,
        OpportunitySharedAmenity.GYM,
        OpportunitySharedAmenity.BIKE_RACK,
        OpportunitySharedAmenity.PET_FRIENDLY,
        OpportunitySharedAmenity.PARKING,
    ];

    static BUILDING_SPACE_PLACEMENT = [
        BuildingSpacePlacement.INTERIOR,
        BuildingSpacePlacement.EXTERIOR,
    ];

    static BUILDING_SPACE_AVAILABILITY = [
        BuildingSpaceAvailability.AVAILABLE,
        BuildingSpaceAvailability.OCCUPIED,
        BuildingSpaceAvailability.UNDER_CONTRACT,
        BuildingSpaceAvailability.RESERVED,
        BuildingSpaceAvailability.DELETED,
        BuildingSpaceAvailability.UNKNOWN,
    ];

    static OPPORTUNITY_FILTER_FIELD_OPTION = [
        OpportunityFilterFieldOption.AND,
        OpportunityFilterFieldOption.OR,
    ]

    static IMAGE_SOURCE = [
        ImageSource.USER_UPLOAD,
        ImageSource.EXTERNAL,
    ]

    static BUILDING_SOURCE = [
        BuildingSource.VALVE,
        BuildingSource.EXTERNAL,
    ]

    static BUILDING_LEASE_TYPE = [
        BuildingLeaseType.MANAGED,
        BuildingLeaseType.SERVICED,
        BuildingLeaseType.LEASED,
    ]

    static BUILDING_COST_UNIT = [
        BuildingCostUnit.PCM,
        BuildingCostUnit.FT,
    ]

    static LONG_LIST_STATUS = [
        LongListStatus.UNEDITED,
        LongListStatus.EDITED,
        LongListStatus.CUSTOM,
    ]

    static VALVE_ALLOWED_PANEL_TITLES_STRING = [
        ValveAllowedPanelTitles.PRIVATE_OFFICE.toString(),
        ValveAllowedPanelTitles.SELF_CONTAINED_MANAGED_SPACE.toString(),
        ValveAllowedPanelTitles.PIPELINE_MANAGED_SPACE.toString(),
    ]

    static BUILDING_ALIAS_TYPE = [
        BuildingAliasType.DISPLAY_ALIAS,
        BuildingAliasType.SEARCH_ALIAS,
    ]

    static OPERATOR_FUNDING_ROUND = [
        OperatorFundingRound.PRE_SEED,
        OperatorFundingRound.SEED,
        OperatorFundingRound.SERIES_A,
        OperatorFundingRound.SERIES_B,
        OperatorFundingRound.UNKNOWN,
    ]

    static OPERATOR_SECTOR_TYPE = [
        OperatorSectorType.GENERAL,
        OperatorSectorType.TECHNOLOGY,
        OperatorSectorType.CREATIVE,
        OperatorSectorType.PROFESSIONAL_SERVICES,
        OperatorSectorType.OTHER,
        OperatorSectorType.UNKNOWN,
    ]

    static OPERATOR_GROWTH_PROFILE = [
        OperatorGrowthProfile.STABLE,
        OperatorGrowthProfile.MODERATE_EXPANSION,
        OperatorGrowthProfile.HIGH_EXPANSION,
        OperatorGrowthProfile.HYPER_EXPANSION,
        OperatorGrowthProfile.UNKNOWN,
    ]

}
```

---

## Bonus: Build a Working NestJS Backend (Optional)

If you have time, use your Zod schemas as the foundation for a working NestJS REST API for the Saxon platform.

### Goals

- Wire your Zod schemas into NestJS as validation pipes using `zod-validation-pipe` or a custom `ZodValidationPipe`
- Build CRUD endpoints for at least two entities
- Demonstrate the relationship between entities in your API design (e.g. fetching spaces for a building)

### Suggested modules to build

#### BuildingModule

- `GET /buildings` — list all buildings (support optional query filters: `leaseType`, `status`)
- `GET /buildings/:id` — get a single building
- `POST /buildings` — create a building (validate body with your Building Zod schema)
- `PUT /buildings/:id` — update a building

#### BuildingSpaceModule

- `GET /buildings/:buildingId/spaces` — list spaces for a building
- `POST /buildings/:buildingId/spaces` — add a space to a building
- `PUT /buildings/:buildingId/spaces/:spaceId` — update a space

#### OperatorModule

- `GET /operators` — list operators
- `POST /operators` — create an operator

### Constraints and expectations

- Use your Zod schemas from the main exercise for request body validation — no separate class-validator decorators
- Use an in-memory store (plain Map or array) if you don't want to wire a database — the focus is on the API structure and validation, not persistence
- Return consistent response shapes: a `data` envelope for single items, `{ data: [], total: number }` for lists
- Use NestJS `HttpException` for error responses (404 when an entity is not found, 400 for validation failures)
- Organise code into modules — one folder per resource with `controller`, `service`, and `dto` files
