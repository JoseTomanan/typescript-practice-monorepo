// @ts-ignore: 2307
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
