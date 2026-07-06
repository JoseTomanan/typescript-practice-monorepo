import { Body, Controller, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BuildingService } from './building.service';
import {
  CreateBuildingDto,
  FindBuildingsQueryDto,
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
  findAll(@Query() query: FindBuildingsQueryDto) {
    // The pipe already validated/parsed the query; findAll returns the full
    // { data, total } envelope, so pass it straight through.
    return this.buildingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { data: this.buildingService.findOne(id) };
  }

  @Post()
  create(@Body(new ZodValidationPipe(createBuildingSchema)) dto: CreateBuildingDto) {
    // NestJS returns HTTP 201 for POST by default.
    return { data: this.buildingService.create(dto) };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBuildingSchema)) dto: UpdateBuildingDto,
  ) {
    // Bind the pipe to @Body only — a method-level pipe would also try to
    // validate the `id` string against the object schema and 400 every request.
    return { data: this.buildingService.update(id, dto) };
  }
}
