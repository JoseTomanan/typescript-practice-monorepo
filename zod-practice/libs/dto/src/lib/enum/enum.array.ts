// @ts-ignore: 2307
import { BuildingAliasType, BuildingCostUnit, BuildingLeaseType, BuildingSource, BuildingStatus, OperatorFundingRound, OperatorGrowthProfile, OperatorSectorType, ValveAllowedPanelTitles } from './building.enum';
// @ts-ignore: 2307
import { ImageSource } from './image.enum';
// @ts-ignore: 2307
import { BuildingSpaceAvailability, BuildingSpacePlacement, OpportunityBudgetUnit, OpportunityFilterFieldOption, OpportunityLeaseType, OpportunityMustHave, OpportunitySharedAmenity, OpportunityStatus } from './opportunity.enum';
// @ts-ignore: 2307
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
