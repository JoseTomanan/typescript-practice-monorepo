import { Body, Controller, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BuildingService } from './building.service';
import {
  CreateBuildingDto,
  UpdateBuildingDto,
  createBuildingSchema,
  findBuildingsQuerySchema,
  updateBuildingSchema,
} from './building.dto';

@Controller('buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(findBuildingsQuerySchema))
  findAll(@Query() _query: unknown) {
    // TODO(you): call `this.buildingService.findAll(_query)`. The pipe above
    // already validated/parsed the query string into a FindBuildingsQueryDto,
    // so `_query` here is safe to pass straight through.
    throw new Error('BuildingController.findAll() not implemented yet');
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    // TODO(you): call `this.buildingService.findOne(_id)` and wrap the result
    // in the required `{ data }` envelope.
    throw new Error('BuildingController.findOne() not implemented yet');
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createBuildingSchema))
  create(@Body() _dto: CreateBuildingDto) {
    // TODO(you): call `this.buildingService.create(_dto)` and wrap the result
    // in `{ data }`. NestJS returns HTTP 201 for POST by default — no extra
    // work needed for the status code.
    throw new Error('BuildingController.create() not implemented yet');
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateBuildingSchema))
  update(@Param('id') _id: string, @Body() _dto: UpdateBuildingDto) {
    // TODO(you): call `this.buildingService.update(_id, _dto)` and wrap the
    // result in `{ data }`.
    throw new Error('BuildingController.update() not implemented yet');
  }
}
